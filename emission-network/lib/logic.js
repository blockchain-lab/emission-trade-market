'use strict';

/**
 * Trade function
 */
function trade(buyer, seller, emission) {
    var assetRegistry;
    var ett = seller.ett;

    console.log("seller's ett = "+ ett);
    console.log("Trade", buyer, seller, emission);

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

        // reduce bought emission from ett
        ett.emission -= emission;

        


    return emission;

}

// add ett to market
function addToMarket(ett, transaction, market) {
    console.log("addToMarket: ", ett, market);

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
            //var ett = seller.ett;

            return query('selectMarketByID', { marketID: baseMarketID })
                .then(function (results) {
                    var promises = [];
                    var market = results[0];

                    // decrease emissionLimit from seller and give to his ett 
                    seller.emissionLimit -= emission;

                    var id = seller.ett.getIdentifier()

                    console.log("emission id", id);

                    return query('selectEttByID', { ettID: id })
                        .then(function (results) {

                            var ett = results[0];
                            console.log("ETT RESULTS = ", ett);
                            ett.emission += emission;

                            return getAssetRegistry('org.emission.network.Market')
                                .then(function (registry) {
                                    return registry.get(baseMarketID)
                                        .then(function (market) {
                                            console.log("update Market", market);

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
                                            console.log("ett reg ", registry.getAll());
                                            console.log("update Ett emission", ett.emission);

                                            promises.push(registry.update(ett));
                                        });
                                })
                                .then(function () {
                                    console.log("done");
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

            var market, ett, marketEtts;
            var promises = [];
            var buyer = results[0];
            var emissionToBuy = transaction.emission;

            return query('selectMarketByID', { marketID: baseMarketID })
                .then(function (results) {

                    market = results[0];
                    marketEtts = market.etts;

                    console.log("market etts", marketEtts);

                    var i = 0;
                    // keep on buying emission from market until all is bought
                    //   if (emissionToBuy > 0) { #
                    var mEtt = marketEtts[i];

                    return query('selectEttByID', { ettID: mEtt.getIdentifier() })
                        .then(function (results) {

                            ett = results[0];
                            console.log("ett ", ett);

                            // get the seller of the ett id on the market
                            return query('selectCompanyByID', { companyID: ett.owner.getIdentifier() })
                                .then(function (results) {
                                    var seller = results[0];
                                    console.log("Seller = ", seller);

                                     // TODO: retrieve ett.owner from reference
                                    var bought = trade(buyer, seller, emissionToBuy);
                                    emissionToBuy -= bought;

                                    console.log("bought " + bought)
        
                                    // if emission is 0 then this ett should not be removed from market
                                    if (ett.emission <= 0) {
                                        removeFromMarket(ett, market);
                                    }
                                })
                                .then(function () {
                                    return getAssetRegistry('org.emission.network.Market')
                                        .then(function (registry) {
                                            console.log("update Market", market);

                                            promises.push(registry.update(market));
                                        })
                                })
                                .then(function () {
                                    return getAssetRegistry('org.emission.network.Ett') // TODO: Error: Expected a Resource or Concept. 
                                        .then(function (registry) {
                                            console.log("update Ett", ett);

                                            promises.push(registry.update(ett));
                                        })
                                })
                                .then(function () {
                                    return getParticipantRegistry('org.emission.network.Company')
                                        .then(function (registry) {
                                            console.log("update Company", buyer);

                                            promises.push(registry.update(buyer));
                                        })
                                })
                                .then(function () {
                                    console.log("done");
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
