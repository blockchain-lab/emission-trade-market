docker exec -it peer0 sh ./scripts/channel_creation.sh
PEERS=( 'peer0' 'peer1' 'peer2' 'peer3' 'peer4' 'peer5' 'peer6' 'peer7' )
# PEERS_CH1=( 'peer0' 'peer1' 'peer2' 'peer3' 'peer4' 'peer5')
# PEERS_CH2=( 'peer0' 'peer1' 'peer4' 'peer5' 'peer6' 'peer7')
# for now every peer tries to join channels so it shows that some are not allowed
for peer in {0..7} ; do
    docker exec -it ${PEERS[$peer]} sh -c "peer channel fetch oldest -o docker.for.mac.localhost:7050 -c ch1" 
    docker exec -it ${PEERS[$peer]} sh -c "peer channel join -b ch1_oldest.block" 
    docker exec -it ${PEERS[$peer]} sh -c "peer channel fetch oldest -o docker.for.mac.localhost:7050 -c ch2" 
    docker exec -it ${PEERS[$peer]} sh -c "peer channel join -b ch2_oldest.block" 
done
# check that it joined channels
docker exec -it peer4 sh -c "peer channel list" 
docker exec -it peer2 sh -c "peer channel list" 
docker exec -it peer6 sh -c "peer channel list" 





