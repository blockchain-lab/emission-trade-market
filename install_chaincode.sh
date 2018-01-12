#!/bin/bash

PEERS=( 'peer0' 'peer1' 'peer2' 'peer3' )

setGlobals () {
    PEER_ID=$1
    export CORE_PEER_LOCALMSPID="Org${PEER_ID}MSP"
    export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/admin/
    export CORE_PEER_ADDRESS=${PEERS[$PEER_ID]}:7051
}

installChaincode () {
    PEER_ID=$1
    setGlobals "$PEER_ID"
    peer chaincode install -n chain -v 1.0 -p ./art/chain.go
}

for ((i=0; i<4; i++))
do
    installChaincode $i
done


