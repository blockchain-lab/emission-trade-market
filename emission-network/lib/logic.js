'use strict';

/**
 * Trade function
 */
function trade(buyer, seller, emission) {
    var assetRegistry;
    var ett = seller.ett;

    // Check if seller can sell ett
    if (seller.emissionLimit < emission) {
        throw "Cannot trade emission: Seller do not have enough emission";
        return;
    }

    // sell maximum what's in the ett's emission   
    if (ett.emission <= emission) {
        emission -= ett.emission;
    }

    // decrease emissionLimit of buyer and inrease emissionLimit of owner   
    seller.emissionLimit -= emission;
    buyer.emissionLimit += emission;

    // if emission is 0 then this ett should not be removed from market
    if (ett.emission <= 0) {
        removeFromMarket(ett);
    }

    // update asset registriy
    return getAssetRegistry('org.emission.network.Ett')
        .then(function (assetRegistry) {
            console.log("update company balance!");
            // TradeEvent(transaction); // TODO: emit event differently ?

            return assetRegistry.updateAll([buyer.ett, seller.ett]);
        });

}

// add ett to market
function addToMarket(ett, market) {
    console.log("addToMarket: ", ett, market);

    var marketEtt = market.etts.find(function(e) {
        return e;
    });
    if(marketEtt != undefined) {
        console.log("ett already in market; increasing its emission");   
        marketEtt.emission += ett.emission;
    } else {
        market.etts.push(ett);
    }

  	// increase emission of market
  	market.emission += ett.emission;

    console.log("added to market ", ett);
}

// remove ett from market
function removeFromMarket(ett, market) {

    var index = market.etts.indexOf(ett);
    if (index > -1) {
        market.etts.splice(index, 1);
    }
    console.log("removed from market ", ett);
}

var baseMarketID = "M0"; // Currently only one market, should be based on channel

/**
 * Sell ett to market
 * @param {org.emission.network.Sell} transaction
 * @transaction
 */
function Sell(transaction) {
    var assetRegistry;
    return query('selectCompanyByID', { companyID: transaction.sellerID })
        .then(function (results) {
      
            var promises = [];
            var seller = results[0];
            var emission = transaction.emission;
            var ett = seller.ett;

            return query('selectMarketByID', { marketID: baseMarketID })
                .then(function (results) {
                    //var promises = [];
                    var market = results[0];
              
                    // decrease emissionLimit from seller and give to his ett 
             		seller.emissionLimit -= emission;                 
              		ett.emission = seller.emissionLimit;
              
              		console.log("emission", ett.emission);
                                  
                    return getAssetRegistry('org.emission.network.Market')
                        .then(function (registry) {
                            return registry.get(baseMarketID)
                                .then(function(market) {
                                    console.log("update Market" , market);

                                    addToMarket(ett, market);
                                    
                                    return registry.update(market);
                                })
                        })                    
                        .then(function () {
                            return getParticipantRegistry('org.emission.network.Company') 
                                .then(function (registry) {
                                    console.log("update Company");

                                    return registry.update(seller);
                                })
                                .catch(function (error) {
                                    console.log(error);
                                    return error;
                                });
                        })
                        .then(function () {
                            return getAssetRegistry('org.emission.network.Ett')// TODO : Error: Expected a Resource or Concept.
                                .then(function (re) {
                                console.log("ett reg ", re.getAll());
                                console.log("update Ett emission", ett.emission);

                                return re.update(ett);
                            	});
                       })
                      .then(function() {                     	
                      		console.log("done");
                            // we have to return all the promises
                            return Promise.all(promises);
                    });
                })
        })
};


/**
 * Buy ett from market
 * @param {org.emission.network.Buy} transaction
 * @transaction
 */
function Buy(transaction) {
    var assetRegistry;

    return query('selectCompanyByID', { companyID: transaction.buyerID })
        .then(function (company) {

            var buyer = company;
            var emissionToBuy = transaction.emission;

            return getAssetRegistry('org.emission.network.Market')
                .then(function (assetRegistry) {
                    console.log("update Market");

                    return query('selectMarketByID', { marketID: baseMarketID })
                        .then(function (result) {
                            var promises = [];
                            var market = result;
                            var marketEtts = market.etts;

                            var i = 0;
                            while (emissionToBuy > 0) {
                                var ett = marketEtts[i];
                                var bought = trade(buyer, ett.owner, emissionToBuy);
                                emissionToBuy -= bought;
                            }

                            removeFromMarket(ett, market);

                            promises.push(assetRegistry.update(market));

                            // we have to return all the promises
                            return Promise.all(promises);
                        })
                })
        })
}

/**
 * Emit event on trade
 * @param {org.emission.network.Trade} transaction
 * @transaction
 */
function TradeEvent(transaction) {
    var factory = getFactory();

    var event = factory.newEvent('org.emission.network', 'TradeEvent');
    event.seller = transaction.seller;
    event.buyer = transaction.buyer;
    event.emission = transaction.emission;
    event.message = "Trade " + event.emission + ": " + event.seller + " -> " + event.buyer;

    emit(event);
}

/**
 * ChangeEttOwner transaction
 * @param {org.emission.network.ChangeEttOwner} Transaction
 * @transaction
 */
function ChangeEttOwner(transaction) {
    var assetRegistry;

    var ett = transaction.ett;
    var prevOwner = ett.owner;

    // undefine previous owner of ett if one exists
    if (prevOwner !== undefined && prevOwner.ett !== undefined) {
        ett.owner.ett = undefined;
    }
    var newOwner = transaction.newOwner;

    // set owner of ett to new owner 
    ett.owner = newOwner;

    // update asset registriy
    // TODO : Error: Cannot update type: Participant to Asset
    return getAssetRegistry('org.emission.network.Ett')
        .then(function (assetRegistry) {
            console.log("update ett");
            return assetRegistry.update(ett);
        })
        .then(function () {
            return getParticipantRegistry('org.emission.network.Company')
                .then(function (registry) {
                    console.log("update company");
                    if (prevOwner !== undefined) {
                        return registry.updateAll([newOwner, prevOwner]);
                    } else {
                        return registry.update(newOwner);
                    }
                });
        });
}
