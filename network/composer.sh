# delete previously created cards, alice is X for org1, bob is Y
composer card delete -n PeerAdmin@byfn-network-org1-only
composer card delete -n PeerAdmin@byfn-network-org1
composer card delete -n PeerAdmin@byfn-network-org2-only
composer card delete -n PeerAdmin@byfn-network-org2
composer card delete -n PeerAdmin@byfn-network-org3-only
composer card delete -n PeerAdmin@byfn-network-org3
composer card delete -n PeerAdmin@byfn-network-org4-only
composer card delete -n PeerAdmin@byfn-network-org4
composer card delete -n X@emission-network
composer card delete -n Y@emission-network
composer card delete -n Z@emission-network
composer card delete -n A@emission-network
composer card create -p ./profiles/connection-org1-only.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem -k ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org1.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem -k ./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org2-only.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem -k ./crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org2.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem -k ./crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org3-only.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp/signcerts/Admin@org3.example.com-cert.pem -k ./crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org3.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp/signcerts/Admin@org3.example.com-cert.pem -k ./crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org4-only.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/signcerts/Admin@org4.example.com-cert.pem -k ./crypto-config/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card create -p ./profiles/connection-org4.json -u PeerAdmin -c ./crypto-config/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/signcerts/Admin@org4.example.com-cert.pem -k ./crypto-config/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/keystore/$(cd crypto-config/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/keystore/ && ls) -r PeerAdmin -r ChannelAdmin
composer card import -f PeerAdmin@byfn-network-org1-only.card
composer card import -f PeerAdmin@byfn-network-org1.card
composer card import -f PeerAdmin@byfn-network-org2-only.card
composer card import -f PeerAdmin@byfn-network-org2.card
composer card import -f PeerAdmin@byfn-network-org3-only.card
composer card import -f PeerAdmin@byfn-network-org3.card
composer card import -f PeerAdmin@byfn-network-org4-only.card
composer card import -f PeerAdmin@byfn-network-org4.card
composer runtime install -c PeerAdmin@byfn-network-org1-only -n emission-network
composer runtime install -c PeerAdmin@byfn-network-org2-only -n emission-network
composer identity request -c PeerAdmin@byfn-network-org1-only -u admin -s adminpw -d X
composer identity request -c PeerAdmin@byfn-network-org2-only -u admin -s adminpw -d Y
composer runtime install -c PeerAdmin@byfn-network-org3-only -n emission-network
composer runtime install -c PeerAdmin@byfn-network-org4-only -n emission-network
composer identity request -c PeerAdmin@byfn-network-org3-only -u admin -s adminpw -d Z
composer identity request -c PeerAdmin@byfn-network-org4-only -u admin -s adminpw -d A
composer network start -c PeerAdmin@byfn-network-org1 -a emission-network@0.0.1.bna -o endorsementPolicyFile=./profiles/endorsement-policy.json -A X -C ./X/admin-pub.pem -A Y -C ./Y/admin-pub.pem -A Z -C ./Z/admin-pub.pem -A A -C ./A/admin-pub.pem 
composer card create -p ./profiles/connection-org1.json -u X -n emission-network -c ./X/admin-pub.pem -k ./X/admin-priv.pem
composer card import -f X@emission-network.card
composer network ping -c X@emission-network
composer card create -p ./profiles/connection-org2.json -u Y -n emission-network -c ./Y/admin-pub.pem -k ./Y/admin-priv.pem
composer card import -f Y@emission-network.card
composer network ping -c Y@emission-network
composer card create -p ./profiles/connection-org3.json -u Z -n emission-network -c ./Z/admin-pub.pem -k ./Z/admin-priv.pem
composer card import -f Z@emission-network.card
composer network ping -c Z@emission-network
composer card create -p ./profiles/connection-org4.json -u A -n emission-network -c ./A/admin-pub.pem -k ./A/admin-priv.pem
composer card import -f A@emission-network.card
composer network ping -c A@emission-network


