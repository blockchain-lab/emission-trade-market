/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const IdCard = require('composer-common').IdCard;
const MemoryCardStore = require('composer-common').MemoryCardStore;
const path = require('path');

require('chai').should();

const network = 'org.emission.network';


describe('Decentralized Energy - check transactions, access', () => {

    // In-memory card store for testing so cards are not persisted to the file system
    const cardStore = new MemoryCardStore();

    // Embedded connection used for local testing
    const connectionProfile = {
        name: 'embedded',
        type: 'embedded'
    };

    // Name of the business network card containing the administrative identity for the business network
    const adminCardName = 'admin';

    // Admin connection to the blockchain, used to deploy the business network
    let adminConnection;

    // This is the business network connection the tests will use.
    let businessNetworkConnection;

    // These are the identities 
    const CAIdentity = 'CAi';
    const CBIdentity = 'CBi';

    let businessNetworkName;
    let factory;
    // These are a list of receieved events.
    let events;
        
    
    before(() => {

        // Embedded connection does not need real credentials
        const credentials = {
            certificate: 'FAKE CERTIFICATE',
            privateKey: 'FAKE PRIVATE KEY'
        };

        // Identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin1',
            roles: [ 'PeerAdmin', 'ChannelAdmin' ]
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);
        const deployerCardName = 'PeerAdmin1';

        adminConnection = new AdminConnection({ cardStore: cardStore });

        return adminConnection.importCard(deployerCardName, deployerCard).then(() => {
            return adminConnection.connect(deployerCardName);
        });
         
     });

     /**
     *
     * @param {String} cardName The card name to use for this identity
     * @param {Object} identity The identity details
     * @returns {Promise} resolved when the card is imported
     */
    function importCardForIdentity(cardName, identity) {
        const metadata = {
            userName: identity.userID,
            version: 1,
            enrollmentSecret: identity.userSecret,
            businessNetwork: businessNetworkName
        };
        const card = new IdCard(metadata, connectionProfile);
        return adminConnection.importCard(cardName, card);
    }

    // This is called before each test is executed.
    beforeEach(() => {

        let businessNetworkDefinition;

        // Generate a business network definition from the project directory.
        return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'))
            .then(definition => {
                businessNetworkDefinition = definition;
                businessNetworkName = definition.getName();
                return adminConnection.install(businessNetworkName);
            })
            .then(() => {
                const startOptions = {
                    networkAdmins: [
                        {
                            userName: 'admin',
                            enrollmentSecret: 'adminpw'
                        }
                    ]
                };
                return adminConnection.start(businessNetworkDefinition, startOptions);
            }).then(adminCards => {
                return adminConnection.importCard(adminCardName, adminCards.get('admin'));
            })
            .then(() => {
                // Create and establish a business network connection
                businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });
                events = [];
                businessNetworkConnection.on('event', event => {
                    events.push(event);
                });
                return businessNetworkConnection.connect(adminCardName);
            })
            .then(() => {
                // Get the factory for the business network.
                factory = businessNetworkConnection.getBusinessNetwork().getFactory();


                // create 2 ett assets
                const producer_ett = factory.newResource(network, 'ETT', 'ETT_CA');
                producer_ett.owner = 'CompanyA';

                const consumer_ett = factory.newResource(network, 'ETT', 'ETT_CB');
                consumer_ett.owner = 'CompanyB';
              
                // create 2 companies
                const compA = factory.newResource(network, 'Company', 'CA');
                compA.name = 'CompanyA';
                compA.energy = factory.newRelationship(network, 'ETT', producer_ett.$identifier);

                const comp2 = factory.newResource(network, 'Company', 'CB');
                comp2.name = 'CompanyB';
                comp2.energy = factory.newRelationship(network, 'ETT', consumer_ett.$identifier);  
                
                // Get the ett registry
                return businessNetworkConnection.getAssetRegistry(network + '.Ett')
                    .then((assetRegistry) => {
                        // add ett to the ett asset registry.
                            return assetRegistry.addAll([producer_ett, consumer_ett])
                        .then((participantRegistry) => {
                            // add resident
                            return participantRegistry.addAll([compA, comp2]);
                        })                        
                    });
            })
            .then(() => {

                // Issue the identities.
                return businessNetworkConnection.issueIdentity('org.emission.network.Company#CA', 'companyA')
                .then((identity) => {
                    return importCardForIdentity(CAIdentity, identity);
                    })
                    .then(() => {
                        //R1Identity = identity;
                        return businessNetworkConnection.issueIdentity('org.decentralized.energy.network.Company#CB', 'companyB');
                    })
                    .then((identity) => {
                        return importCardForIdentity(CBIdentity, identity);
                    });                
            });
    });

    

    describe('#CompanyToCompany Transaction', () => {

        it('Company should be able to execute transactions with Company' , () => {
            
            // create the resident to resident transaction
            const resident_to_resident = factory.newTransaction(network, 'ChangeEttOwner');
            resident_to_resident.newOwner = compB;
            resident_to_resident.ett = 10;
            resident_to_resident.coinsInc = factory.newRelationship(network, 'Ett', 'CO_R1');
    
            return businessNetworkConnection.submitTransaction(resident_to_resident)                    
                    .then(() => {
                        return businessNetworkConnection.getAssetRegistry(network + '.Coins');
                    })
                    .then((assetRegistry) => {
                        // re-get the producer_coins
                        return assetRegistry.get('CO_R1');
                    })
                    .then((updated_producer_coins) => {
                        // the updated values of coins
                        updated_producer_coins.value.should.equal(340);
                        return businessNetworkConnection.getAssetRegistry(network + '.Coins');
                    })
                    .then((assetRegistry) => {
                        // re-get the consumer_coins
                        return assetRegistry.get('CO_R2');
                    })
                    .then((updated_consumer_coins) => {
                        // the updated values of coins
                        updated_consumer_coins.value.should.equal(410);
                        return businessNetworkConnection.getAssetRegistry(network + '.Energy');
                    })
                    .then((assetRegistry) => {
                        // re-get the consumer_energy
                        return assetRegistry.get('EN_R2');
                    })
                    .then((updated_consumer_energy) => {
                        // the updated values of energy
                        updated_consumer_energy.value.should.equal(15);
                        return businessNetworkConnection.getAssetRegistry(network + '.Energy');
                    })
                    .then((assetRegistry) => {
                        // re-get the producer_energy
                        return assetRegistry.get('EN_R1');
                    })
                    .then((updated_producer_energy) => {
                        // the updated values of energy
                        updated_producer_energy.value.should.equal(25);
                    });
                
        }); 
    });

    describe('#ResidentToBank Transaction', () => {

        it('Residents should be able to execute transactions with Banks' , () => {
            
            // create the resident to resident transaction
            const resident_to_bank = factory.newTransaction(network, 'CashToCoins');
            resident_to_bank.cashRate = 2;
            resident_to_bank.cashValue = 20;
            resident_to_bank.coinsInc = factory.newRelationship(network, 'Coins', 'CO_B1');
            resident_to_bank.coinsDec = factory.newRelationship(network, 'Coins', 'CO_R1');
            resident_to_bank.cashInc = factory.newRelationship(network, 'Cash', 'CA_R1');
            resident_to_bank.cashDec = factory.newRelationship(network, 'Cash', 'CA_B1');
                           
             // submit the transaction        
            return businessNetworkConnection.submitTransaction(resident_to_bank)               
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(network + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the producer_coins
                    return assetRegistry.get('CO_R1');
                })
                .then((updated_resident_coins) => {
                    // the updated values of coins
                    updated_resident_coins.value.should.equal(260);
                    return businessNetworkConnection.getAssetRegistry(network + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the consumer_coins
                    return assetRegistry.get('CO_B1');
                })
                .then((updated_bank_coins) => {
                    // the updated values of coins
                    updated_bank_coins.value.should.equal(5040);
                    return businessNetworkConnection.getAssetRegistry(network + '.Cash');
                })
                .then((assetRegistry) => {
                    // re-get the resident_cash
                    return assetRegistry.get('CA_R1');
                })
                .then((updated_resident_cash) => {
                    // the updated values of energy
                    updated_resident_cash.value.should.equal(170);
                    return businessNetworkConnection.getAssetRegistry(network + '.Cash');
                })
                .then((assetRegistry) => {
                    // re-get the resident_cash
                    return assetRegistry.get('CA_B1');
                })
                .then((updated_bank_cash) => {
                    // the updated values ofenergyenergy
                    updated_bank_cash.value.should.equal(6980);
                });                
        }); 
    });


    describe('#ResidentToUtilityCompany Transaction', () => {

        it('Residents should be able to execute transactions with UtilityCompanies' , () => {
            
            
            // create the resident to utility company transaction
            const resident_to_utility = factory.newTransaction(network, 'EnergyToCoins');
            resident_to_utility.energyRate = 4;
            resident_to_utility.energyValue = 10;
            resident_to_utility.coinsInc = factory.newRelationship(network, 'Coins', 'CO_U1');
            resident_to_utility.coinsDec = factory.newRelationship(network, 'Coins', 'CO_R2');
            resident_to_utility.energyInc = factory.newRelationship(network, 'Energy', 'EN_R2');
            resident_to_utility.energyDec = factory.newRelationship(network, 'Energy', 'EN_U1');
               
            return businessNetworkConnection.submitTransaction(resident_to_utility)                
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(network + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the utility_coins
                    return assetRegistry.get('CO_U1');
                })
                .then((updated_utility_coins) => {
                    // the updated values of coins
                    updated_utility_coins.value.should.equal(5040);
                    return businessNetworkConnection.getAssetRegistry(network + '.Coins');
                })
                .then((assetRegistry) => {
                    // re-get the consumer_coins
                    return assetRegistry.get('CO_R2');
                })
                .then((updated_consumer_coins) => {
                    // the updated values of coins
                    updated_consumer_coins.value.should.equal(410);
                    return businessNetworkConnection.getAssetRegistry(network + '.Energy');
                })
                .then((assetRegistry) => {
                    // re-get the consumer_energy
                    return assetRegistry.get('EN_R2');
                })
                .then((updated_consumer_energy) => {
                    // the updated values of energy
                    updated_consumer_energy.value.should.equal(15);
                    return businessNetworkConnection.getAssetRegistry(network + '.Energy');
                })
                .then((assetRegistry) => {
                    // re-get the utility_energy
                    return assetRegistry.get('EN_U1');
                })
                .then((updated_utility_energy) => {
                    // the updated values of energy
                    updated_utility_energy.value.should.equal(990);
                    
                });                
        }); 
    });

    /**
     * Reconnect using a different identity.
     * @param {String} cardName The identity to use.
     * @return {Promise} A promise that will be resolved when complete.
     */
    function useIdentity(cardName) {
        
        return businessNetworkConnection.disconnect()
            .then(() => {                
                businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });                                
                return businessNetworkConnection.connect(cardName);
            });
    }
    
        
    describe('#Residents Access', () => {
        
        it('Residents should have read access to all coins, energy and cash assets, read access to other Residents, Banks and Utility Companies, and update only their own Resident record' , () => {                        
            
            return useIdentity(CBIdentity)
                .then(() => {
                    // use a query                    
                    return businessNetworkConnection.query('selectResidents');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(2); 
                    //results[0].getIdentifier().should.equal('R2');                           
                })                
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectBanks');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(1);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectUtilityCompanies');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(1);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCoins');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(4);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCash');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(3);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectEnergy');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(3);                            
                });
                
        });
    });

    describe('#Banks Access', () => {

        it('Banks should have read only access to all coins and cash assets, read access to other Banks and Residents, and update access to their own Bank record' , () => {
            
            return useIdentity(B1Identity)
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectResidents');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(2); 
                    //results[0].getIdentifier().should.equal('R2');                           
                })                
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectBanks');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(1);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectUtilityCompanies');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(0);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCoins');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(4);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCash');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(3);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectEnergy');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(0);                            
                });
                
        });
    });


    describe('#Utility Company Access', () => {

        it('Utility Company should have read only access to all coins, and energy assets, read access to other Utilty Companies and Residents, and update access to their own Bank record' , () => {
            
            return useIdentity(U1Identity)
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectResidents');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(2); 
                    //results[0].getIdentifier().should.equal('R2');                           
                })                
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectBanks');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(0);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectUtilityCompanies');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(1);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCoins');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(4);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectCash');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(0);                            
                })
                .then(() => {
                    // use a query
                    return businessNetworkConnection.query('selectEnergy');
                })
                .then((results) => {
                    // check results
                    results.length.should.equal(3);                            
                });
                
        });
    });
    
});
