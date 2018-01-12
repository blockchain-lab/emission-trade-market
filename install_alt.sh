PEERS=( 'peer0' 'peer1' 'peer2' 'peer3' )

for ((i=0; i<4; i++))
do
    PEER_ID=$i
    docker exec -it cli sh -c "CORE_PEER_LOCALMSPID=Org${PEER_ID}MSP && CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/admin${PEER_ID}/ && CORE_PEER_ADDRESS=${PEERS[$PEER_ID]}:7051 && peer chaincode install -n chain -v 1.0 -p scripts/"
done
