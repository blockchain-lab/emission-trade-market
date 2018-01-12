'use strict';
/**
 * Trade transaction
 * @param {org.emission.network.Trade} Transaction
 * @transaction
 */
function Trade(transaction) {
	var assetRegistry;

    // get buyer and seller and ettToSell
    var buyer = transaction.buyer;
    var seller = transaction.seller;
  	var emToTrade = transaction.emissionToTrade;
    
  	// Check if company can trade ett
    if(seller.ett.limit < emToTrade) {
        throw "Cannot trade emission: Seller do not have enough emission";
        return;        
    }

    // decrease emission of buyer and inrease emission of owner
    buyer.ett.limit += emToTrade;
   	seller.ett.limit -= emToTrade;
    
    // update asset registriy
    return  getAssetRegistry('org.emission.network.Ett')
      .then(function (assetRegistry) {
          console.log("update company balance!");
          return assetRegistry.updateAll([buyer.ett, seller.ett]);
      }); 
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
    if(prevOwner !== undefined && prevOwner.ett !== undefined) {
        ett.owner.ett = undefined;
    }   
    var newOwner = transaction.newOwner;

    // set owner of ett to new owner 
    ett.owner = newOwner;
    
    // update asset registriy
 	// TODO : Error: Cannot update type: Participant to Asset
    return getAssetRegistry('org.emission.network.Ett')
        .then(function(assetRegistry) {
            console.log("update ett");
            return assetRegistry.update(ett);
        })
        .then(function() {
            return  getParticipantRegistry('org.emission.network.Company')
            .then(function (partRegistry) {
                console.log("update company");
                if(prevOwner !== undefined) {
                    return partRegistry.updateAll([newOwner, prevOwner]);
                } else {
                    return partRegistry.update(newOwner);
                }
            });  
        });
}


/**
* GiveEtt transaction
* @param {org.emission.network.GiveEtt} Transaction
* @transaction
*/
function GiveEtt(transaction) {
    var assetRegistry;
        
    
    
    
  }
  
  