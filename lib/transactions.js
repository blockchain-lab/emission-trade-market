/**
 * ETT asset transaction
 * @param {org.decentralized.emission.network} UpdateValues 
 * @transaction
 */
function EnergyToCoins(UpdateValues) {

    console.log("EnergyToCoins, UpdateValues ", UpdateValues);
    //update values of the ETT
    UpdateValues.energyInc.value = UpdateValues.energyInc.value + UpdateValues.energyValue;
    UpdateValues.energyDec.value = UpdateValues.energyDec.value - UpdateValues.energyValue;

    return  getAssetRegistry('org.decentralized.emission.network.Ett')
    .then(function (assetRegistry) {
        return assetRegistry.updateAll([UpdateValues.energyInc,UpdateValues.energyDec]);
    });         
   
}

