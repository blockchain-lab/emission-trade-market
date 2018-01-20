'use strict';

// add ett to market
function addToMarket(ett, transaction, market) {
    var marketEtt = false;
    var i;
    for (i = 0; i < market.etts.length; i++) {
        if (market.etts[i].toString().split("{")[1] === ett.toString().split("{")[1]) {
            marketEtt = true;
            break;
        }
    }
    if (marketEtt) {
        console.log("company already in market; increasing its ett");
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
    var etts = market.etts;
    console.log("market.etts = " + etts);

    etts.forEach(function (e) {
        if (e.id === ett.id) {
            etts.splice(etts.indexOf(e), 1);
            console.log("removed ett from market ");
        }
    })
}

var marketID = "M0";
/**
 * API Transaction to sell ett to market
 *
 * @param {org.emission.network.Sell} transaction
 * @transaction
 */
function Sell(transaction) {
    return query('selectCompanyByID', {companyID: transaction.sellerID})
        .then(function (results) {

            var seller = results[0];
            var emission = transaction.emission;
            var ettRef = seller.ett;

            return query('selectMarketByID', {marketID: marketID})
                .then(function (results) {
                    var market = results[0];

                    // Check if seller has enough emission to sell
                    if (seller.emissionLimit < emission) {
                        throw "Cannot sell emission: Seller have " + seller.emissionLimit
                        + ". You are trying to buy " + emission;
                    }
                    // decrease emissionLimit from seller and give to his ett 
                    seller.emissionLimit -= emission;

                    return query('selectEttByID', {ettID: ettRef.getIdentifier()})
                        .then(function (results) {
                            var ett = results[0];
                            ett.emission += emission;
                            addToMarket(ett, transaction, market);
                            return ett;
                        })
                        .then(function (ett) {
                            return updateMarket(market)
                                .then(updateCompany(seller))
                                .then(updateEtt(ett))
                        })
                })
        })
}

/**
 * API Transaction to buy ett from market
 *
 * @param {org.emission.network.Buy} transaction
 * @transaction
 */
function Buy(transaction) {

    return query('selectCompanyByID', {companyID: transaction.buyerID})
        .then(function (results) {
            var buyer = results[0];

            return query('selectMarketByID', {marketID: marketID})
                .then(function (results) {
                    var market = results[0];

                    return buyFromMarket(buyer, market, transaction.emission);
                })
        })
}

function buyFromMarket(buyer, market, emission) {

    var promises = [];
    var etts = market.etts;

    if(emission > market.emission) {
        throw "Cannot buy emission: market have " + market.emission
            + ". You are trying to buy " + emission;
    }

    for (var i = 0; i < etts.length; i++) {

        if (emission >= 0) {
            var ettRef = etts[i];
            if (ettRef === undefined) {
                console.warn("Cannot buy emission: No more Ett in the market.");
                return;
            }

            promises.push(query('selectEttByID', {ettID: ettRef.getIdentifier()})
                .then(function (results) {
                    var ett = results[0];
                    console.log("ett = " + ett);

                    emission -= updateEmissionFields(buyer, ett, market, emission);

                    promises.push(updateEtt(ett));
                    promises.push(updateCompany(buyer));
                    promises.push(updateMarket(market));
                })
            )
        }
    }
    // execute all promises
    return Promise.all(promises);
}

function updateEmissionFields(buyer, ett, market, emission) {

    var emToBuy = emission;

    // sell maximum what's in the ett's emission   
    if (ett.emission < emToBuy) {
        emToBuy = ett.emission;
    }

    // decrease emissionLimit of buyer and inrease emissionLimit of owner                       
    buyer.emissionLimit += emToBuy;
    emission -= emToBuy;
    ett.emission -= emToBuy;
    market.emission -= emToBuy;

    console.log(buyer.name + " emission level increased to " + buyer.emissionLimit);

    // if all emission is bought then this Ett should be removed from market
    if (ett.emission <= 0) {
        removeFromMarket(ett, market);
    }

    return emToBuy;
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
    return updateEtt(ett)
        .then(function () {
            if (prevOwner !== undefined) {
                updateCompanies(newOwner, prevOwner);
            } else {
                updateCompany(newOwner);
            }
        });
}


function updateMarket(market) {
    return getAssetRegistry('org.emission.network.Market')
        .then(function (registry) {
            console.log("update Market #" + market);

            return registry.update(market)
        })
}

function updateCompany(company) {
    return getParticipantRegistry('org.emission.network.Company')
        .then(function (registry) {
            console.log("update Company #" + company);

            return registry.update(company);
        })
}

function updateEtt(ett) {
    return getAssetRegistry('org.emission.network.Ett')
        .then(function (registry) {
            console.log("update Ett #" + ett);

            return registry.update(ett);
        })
}

function updateCompanies(buyer, seller) {
    return getParticipantRegistry('org.emission.network.Company')
        .then(function (registry) {
            console.log("update Companies #" + [buyer.companyID, seller.companyID]);

            return registry.updateAll([buyer, seller]);
        })
}