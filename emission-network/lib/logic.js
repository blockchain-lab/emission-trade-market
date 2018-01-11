'use strict';
/**
 * Transction processor functions
 */

/**
 * ChangeEttOwner transaction
 * @param {org.emission.network.ChangeEttOwner} Transaction
 * @transaction
 */
function ChangeEttOwner(transaction) {
    var assetRegistry;

    // ger previous and new owner 
    var prevOwner = transaction.ett.owner;
    var newOwner = transaction.newOwner;

    // set owner of ett to new owner 
    ett.owner = newOwner;
    
    // decrease and inrease balance of owners
    prevOwner.etts = prevOwner.etts - 1;
    newOwner.etts = newOwner.etts + 1;
    
    // update asset registriy
    return getAssetRegistry('org.emission.network.Ett')
        .then(function(ar) {
            console.log("update Ett owner!");
            return setRegistry.update(ett.owner);
        })
        .then(function() {
            return  getAssetRegistry('org.emission.network.Company')
            .then(function (assetRegistry) {
                console.log("update company balance!");
                return assetRegistry.updateAll([prevOwner.etts, newOwner.etts]);
            });  
        });
}