rm -rf artifacts
rm -rf crypto-config
mkdir artifacts
HOSTIP=$(ipconfig getifaddr en0)
sed -i '' 's/192.168.0.100/'"$(ipconfig getifaddr en0)"'/g' *.yaml
sed -i '' 's/192.168.0.100/'"$(ipconfig getifaddr en0)"'/g' channels_up.sh
./bin/cryptogen generate --config=./crypto-config.yaml
export FABRIC_CFG_PATH=$PWD
./bin/configtxgen -profile FourOrgsOrdererGenesis -outputBlock ./artifacts/genesis.block
./bin/configtxgen -profile Channel1 -outputCreateChannelTx ./artifacts/ch1.tx -channelID ch1
./bin/configtxgen -profile Channel2 -outputCreateChannelTx ./artifacts/ch2.tx -channelID ch2
./bin/configtxgen -profile Channel1 -outputAnchorPeersUpdate ./artifacts/Org0MSPanchors1.tx -channelID ch1 -asOrg Org0MSP
./bin/configtxgen -profile Channel2 -outputAnchorPeersUpdate ./artifacts/Org0MSPanchors2.tx -channelID ch2 -asOrg Org0MSP
./bin/configtxgen -profile Channel1 -outputAnchorPeersUpdate ./artifacts/Org1MSPanchors1.tx -channelID ch1 -asOrg Org1MSP
./bin/configtxgen -profile Channel1 -outputAnchorPeersUpdate ./artifacts/Org2MSPanchors1.tx -channelID ch1 -asOrg Org2MSP
./bin/configtxgen -profile Channel2 -outputAnchorPeersUpdate ./artifacts/Org2MSPanchors2.tx -channelID ch2 -asOrg Org2MSP
./bin/configtxgen -profile Channel2 -outputAnchorPeersUpdate ./artifacts/Org3MSPanchors2.tx -channelID ch2 -asOrg Org3MSP