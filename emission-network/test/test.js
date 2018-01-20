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

    // Embedded con used for local testing
    const connectionProfile = {
        name: 'embedded',
        type: 'embedded'
    };

    // Name of the business network card containing the administrative identity for the business network
    const adminCardName = 'admin';

    // Admin con to the blockchain, used to deploy the business network
    let adminConnection;

    // This is the business network con the tests will use.
    let con;

    // These are the identities 
    const C1Identity = 'C1';
    const C2Identity = 'C2';
    const C3Identity = 'C3';


    let businessNetworkName;
    let factory;
    // These are a list of receieved events.
    let events;

    let etts = [];
    let companies = [];
    let members;
    let marketID = "M0";


    before(() => {

        // Embedded con does not need real credentials
        const credentials = {
            certificate: 'FAKE CERTIFICATE',
            privateKey: 'FAKE PRIVATE KEY'
        };

        // Identity used with the admin con to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin1',
            roles: ['PeerAdmin', 'ChannelAdmin']
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);
        const deployerCardName = 'PeerAdmin1';

        adminConnection = new AdminConnection({cardStore: cardStore});

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
        let promises = [];

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
                // Create and establish a business network con
                con = new BusinessNetworkConnection({cardStore: cardStore});
                events = [];
                con.on('event', event => {
                    events.push(event);
                });
                return con.connect(adminCardName);
            })
            .then(() => {
                // Get the factory for the business network.
                factory = con.getBusinessNetwork().getFactory();

                members = 3;
                for (let i = 0; i < members; i++) {
                    let ett, company;
                    ett = factory.newResource(network, 'Ett', i + "");
                    ett.ettID = i + "";
                    ett.owner = factory.newRelationship(network, 'Company', i + "");
                    ett.emission = 0;

                    company = factory.newResource(network, 'Company', i + "");
                    company.companyID = i + "";
                    company.name = "Company" + i;
                    company.ett = factory.newRelationship(network, 'Ett', i + "");
                    company.emissionLimit = 1000;
                    company.emissionConsumed = 0;

                    etts[i] = ett;
                    companies[i] = company;
                }

                // create the market
                const market = factory.newResource(network, 'Market', marketID);
                market.emission = 0;
                market.etts = [];
                market.marketID = marketID;

                // Get the ett registry
                updateEtts(etts)
                    .then(updateCompanies(companies))
                    .then(updateMarket(market))
                    .then(() => {
                        // Issue the identities.
                        return con.issueIdentity('org.emission.network.Company#1', '1')
                            .then((identity) => {
                                return importCardForIdentity(C1Identity, identity);
                            })
                            .then(() => {
                                return con.issueIdentity('org.emission.network.Company#2', '2');
                            })
                            .then((identity) => {
                                return importCardForIdentity(C2Identity, identity);
                            })
                            .then(() => {
                                return con.issueIdentity('org.emission.network.Company#0', '0');
                            })
                            .then((identity) => {
                                return importCardForIdentity(C3Identity, identity);
                            });
                    });
            });
    });

    describe('#Sell Transaction', () => {

        it('Companies should be able to sell emission to the market', () => {

            const transaction = factory.newTransaction(network, 'Sell');

            let i, promises = [];
            for (i = 0; i < companies.length; i++) {
                let comp = companies[i];

                console.log(comp.companyID);

                transaction.sellerID = comp.companyID;
                transaction.emission = 100;

                return con.getAssetRegistry(network + '.Ett')
                    .then((registry) => {
                        return registry.get(comp.ett.ettID);
                    })
                    .then((ett) => {
                        promises.push(updateMarket(marketID));
                        promises.push(updateEtt(ett));
                    })
                    .then(() => {
                        return con.getParticipantRegistry(network + '.Company')
                    })
                    .then((registry) => {
                        return registry.get(comp.companyID);
                    })
                    .then((comp) => {
                        console.log(comp.companyID);
                        promises.push(updateCompany(comp));
                    })
            }
            Promise.all(promises)
                .then(() => {
                    return con.getAssetRegistry(network + '.Market')
                        .then((registry) => {
                            return registry.get(marketID)
                                .then((market) => {

                                    // the updated market emission
                                    market.emission.should.equal(100 * i);
                                    market.etts.length.should.equal(i);
                                    return market.ett[i].owner.companyID.should.equal(transaction.sellerID);
                                })
                        })
                })
        })
    });

    describe('#Buy Transaction', () => {

        it('Companies should be able to buy emission from all ett in the market', () => {

            const transaction = factory.newTransaction(network, 'Buy');

            transaction.buyerID = companies[0].companyID;
            transaction.emission = 250;

            return con.submitTransaction(transaction)
                .then(() => {
                    return con.getAssetRegistry(network + '.Market');
                })
                .then((assetRegistry) => {
                    return assetRegistry.get(marketID);
                })
                .then((market) => {
                    // the updated market emission
                    market.emission.should.equal(50);
                    return market.etts.length.should.equal(1); // should be only 1 ett left on the market
                })
                .then(() => {
                    return con.getAssetRegistry(network + '.Company');
                })
                .then((registry) => {
                    // the updated market emission
                    let cmps = registry[0];
                    cmps[0].emissionLimit.should.equal(1000 + 250); // this guy buys, the rest sells
                    cmps[1].emissionLimit.should.equal(1000 - 250);
                    cmps[2].emissionLimit.should.equal(1000 - 250);

                    return market.etts.length.should.equal(0); // market should be empty
                })
                .then(() => {
                    return con.getAssetRegistry(network + '.Ett');
                })
                .then((etts) => {
                    // the updated market emission
                    let sum = 0;
                    for (let i = 0; i < etts.length; i++) {
                        sum += etts[i].emission;
                    }
                    return sum.should.equal(50);
                })
        });
    });

    function updateEtts(etts) {
        return con.getAssetRegistry('org.emission.network.Ett')
            .then(function (registry) {
                console.log("test update Etts #" + etts);

                return registry.updateAll(etts)
            })
    }

    function updateMarket(market) {
        return con.getAssetRegistry('org.emission.network.Market')
            .then(function (registry) {
                console.log("test update Market #" + market);

                return registry.update(market)
            })
    }

    function updateCompany(company) {
        return con.getParticipantRegistry('org.emission.network.Company')
            .then(function (registry) {
                console.log("test update Company #" + company);

                return registry.update(company);
            })
    }

    function updateEtt(ett) {
        return con.getAssetRegistry('org.emission.network.Ett')
            .then(function (registry) {
                console.log("test update Ett #" + ett);

                return registry.update(ett);
            })
    }

    function updateCompanies(buyer, seller) {
        return con.getParticipantRegistry('org.emission.network.Company')
            .then(function (registry) {
                console.log("test update Companies #" + [buyer.companyID, seller.companyID]);

                return registry.updateAll([buyer, seller]);
            })
    }

    /**
     * Reconnect using a different identity.
     * @param {String} cardName The identity to use.
     * @return {Promise} A promise that will be resolved when complete.
     */
    function useIdentity(cardName) {

        return con.disconnect()
            .then(() => {
                con = new BusinessNetworkConnection({cardStore: cardStore});
                return con.connect(cardName);
            });
    }
});
