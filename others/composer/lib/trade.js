
function Buy(tx) {  
  	// TODO: find nox from market
    // var nox = tx.asset;
  	var buyer = tx.owner; 
  	if(nox.state !== 'FOR_SALE') {
    	throw new error('Listing is not for sale!')   
    }
  	if(buyer.balance < noxPrice) {
      // TODO      		  
    }  	
}

/**
 * Sell transaction processor function.
 * @param {org.acme.sample.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
function Sell(tx) {
  	var seller = tx.owner; 
    var nox = tx.nox;
    if(nox.state == 'FOR_SALE') {
    	throw new error('Nox is already for sale!')   
    }
  	nox.state = 'FOR_SALE';
  	tx.market.push(nox);  // TODO 
  	  	 
    return getAssetRegistry('org.acme.sample.Market')
        .then(function (marketRegistry) {
	        // Update the asset in the asset registry.
            return marketRegistry.update(nox);
        })
  		.then(function () {
            return getAssetRegistry('org.acme.sample.Organization')
    	})        
  		.then(function(orgRegistry) {
      		orgRegistry.update(nox.owner)
    	})
        .then(function () {
            // Emit an event for the modified nox.
            var event = getFactory().newEvent('org.acme.sample', 'NoxEvent');
            event.nox = nox;
            event.owner = nox.owner;
            emit(event);
        });

}
