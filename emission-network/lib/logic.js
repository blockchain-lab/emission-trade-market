'use strict';

/**
 * Trade function
 */
function trade(buyer, ett, emission) {
    var assetRegistry;

    // sell maximum what's in the ett's emission   
    if (ett.emission < emission) {
        console.warn("trying to buy more ett than avaible in ett: " + ett.emission + " < " + emission);
        emission = ett.emission;
    }
    // decrease emissionLimit of buyer and inrease emissionLimit of owner   
    buyer.emissionLimit += emission;

    return emission;
}

// add ett to market
function addToMarket(ett, transaction, market) {
    var marketEtt = false;
  	var i;
    for(i = 0; i < market.etts.length; i++){
      if (market.etts[i].toString().split("{")[1] == ett.toString().split("{")[1]){
      	marketEtt = true;
        break;
      }
    }
    if (marketEtt) {
        console.log("ett already in market; increasing its emission");
        marketEtt.emission += transaction.emission;
    } else {
        console.log("pushed ett to market");
        market.etts.push(ett);
    }

    // increase emission of market
    market.emission += transaction.emission;
}

// remove ett from market
function removeFromMarket(ett, market) {

    var index = market.etts.indexOf(ett);
    if (index > -1) {
        market.etts.splice(index, 1);
    }
    console.log("removed ett from market ");
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
            //var ett = seller.ett;

            return query('selectMarketByID', { marketID: baseMarketID })
                .then(function (results) {
                    var promises = [];
                    var market = results[0];

                    // Check if seller has enough emission to sell
                    if (seller.emissionLimit < emission) {
                        throw "Cannot trade emission: Seller do not have enough emission";
                        return;
                    }
                    // decrease emissionLimit from seller and give to his ett 
                    seller.emissionLimit -= emission;

                    var id = seller.ett.getIdentifier()

                    return query('selectEttByID', { ettID: id })
                        .then(function (results) {

                            var ett = results[0];
                            ett.emission += emission;

                            return getAssetRegistry('org.emission.network.Market')
                                .then(function (registry) {
                                    return registry.get(baseMarketID)
                                        .then(function (market) {
                                            console.log("update Market");

                                            addToMarket(ett, transaction, market);

                                            promises.push(registry.update(market));
                                        })
                                })
                                .then(function () {
                                    return getParticipantRegistry('org.emission.network.Company')
                                        .then(function (registry) {
                                            console.log("update Company");

                                            promises.push(registry.update(seller));
                                        })
                                })
                                .then(function () {
                                    return getAssetRegistry('org.emission.network.Ett')
                                        .then(function (registry) {
                                            console.log("update Ett ");

                                            promises.push(registry.update(ett));
                                        });
                                })
                                .then(function () {
                                    // we have to return all the promises
                                    return Promise.all(promises);
                                });
                        })
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
        .then(function (results) {

            var market, seller, marketEtt, marketEtts;
            var promises = [];
            var buyer = results[0];
            var emissionToBuy = transaction.emission;

            return query('selectMarketByID', { marketID: baseMarketID })
                .then(function (results) {

                    market = results[0];
                    marketEtts = market.etts;

                    // keep on buying emission from market until all is bought
                    var ett = marketEtts[0];

                    return query('selectEttByID', { ettID: ett.getIdentifier() })
                        .then(function (results) {

                            marketEtt = results[0];

                            // get the seller of the ett id on the market
                            return query('selectCompanyByID', { companyID: marketEtt.owner.getIdentifier() })
                                .then(function (results) {
                                    seller = results[0];
                                    
                                    var bought = trade(buyer, marketEtt, emissionToBuy);
                                    console.log(buyer + " bought " + bought + " emission from " + seller);
                              
                              		// decrease emission bought from market
                                    marketEtt.emission -= bought;
                                    market.emission -= bought;
                                                                    
                                    // if emission is 0 then this ett should be removed from market
                                    if (marketEtt.emission <= 0) {
                                        removeFromMarket(marketEtt, market);
                                    }
                                })
                                .then(function () {
                                    return getAssetRegistry('org.emission.network.Market')
                                        .then(function (registry) {
                                            console.log("update Market");

                                            promises.push(registry.update(market));
                                        })
                                })
                                .then(function () {
                                    return getAssetRegistry('org.emission.network.Ett') 
                                        .then(function (registry) {
                                            console.log("update Ett");

                                            promises.push(registry.update(marketEtt));
                                        })
                                })
                                .then(function () {
                                    return getParticipantRegistry('org.emission.network.Company')
                                        .then(function (registry) {
                                            console.log("update Company");

                                            promises.push(registry.updateAll([buyer, seller]));
                                        })
                                })
                                .then(function () {
                                    // we have to return all the promises
                                    return Promise.all(promises);
                                });

                        })
                    //    }                             
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
