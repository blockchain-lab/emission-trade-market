# delete previously created cards, alice is X for org1, bob is Y
composer card delete -n PeerAdmin@byfn-network-org1-only
composer card delete -n PeerAdmin@byfn-network-org1
composer card delete -n PeerAdmin@byfn-network-org2-only
composer card delete -n PeerAdmin@byfn-network-org2
composer card delete -n X@tutorial-network
composer card delete -n Y@tutorial-network
composer card delete -n admin@tutorial-network
composer card delete -n PeerAdmin@fabric-network
composer card create -p ./profiles/connection-org1-only.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem -k ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org1.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem -k ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org2-only.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem -k ./crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org2.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem -k ./crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card import -f PeerAdmin@byfn-network-org1-only.card
composer card import -f PeerAdmin@byfn-network-org1.card
composer card import -f PeerAdmin@byfn-network-org2-only.card
composer card import -f PeerAdmin@byfn-network-org2.card
composer runtime install -c PeerAdmin@byfn-network-org1-only -n tutorial-network
composer runtime install -c PeerAdmin@byfn-network-org2-only -n tutorial-network
composer identity request -c PeerAdmin@byfn-network-org1-only -u admin -s adminpw -d X
composer identity request -c PeerAdmin@byfn-network-org2-only -u admin -s adminpw -d Y
composer network start -c PeerAdmin@byfn-network-org1 -a tutorial-network@0.0.1.bna -o endorsementPolicyFile=./profiles/endorsement-policy.json -A X -C ./X/admin-pub.pem -A Y -C ./Y/admin-pub.pem
composer card create -p ./profiles/connection-org1.json -u X -n tutorial-network -c ./X/admin-pub.pem -k ./X/admin-priv.pem
composer card import -f X@tutorial-network.card
composer network ping -c X@tutorial-network
composer card create -p ./profiles/connection-org2.json -u Y -n tutorial-network -c ./Y/admin-pub.pem -k ./Y/admin-priv.pem
composer card import -f Y@tutorial-network.card
composer network ping -c Y@tutorial-network


