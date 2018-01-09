
    docker exec -it peer0 sh -c "peer channel create -o orderer0:7050 -c ch1 -f ./art/Org0MSPanchors1.tx" 
    docker exec -it peer0 sh -c "ls" 
      docker exec -it peer0 sh -c "peer channel create -o docker.for.mac.localhost:7050 -c ch1 -f ./art/ch1.tx --cafile ./etc/hyperledger/fabric/admin/admincerts/Admin@org0-cert.pem" 
            docker exec -it peer0 sh -c "peer channel join --help" 

            CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/user/


                        docker exec -it peer0 sh -c "export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/admin/" 

   docker exec -it peer0 bash
--cafile



                        docker exec -it peer0 sh -c "echo CORE_PEER_MSPCONFIGPATH" 
