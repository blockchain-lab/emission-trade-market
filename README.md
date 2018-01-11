## How to run:

 Start fabric and create peer admin card:
```
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
```
Install the composer runtime: 
```
composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName emission-network
```
Deploy the emission network:
```
composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile emission-network@0.0.1.bna --file networkadmin.card
```
Import the network administrator identity as a usable business network card:
```
composer card import --file networkadmin.card
```
Ping to see that network is running properly:
```
composer network ping --card admin@emission-network
```
To create the REST API:
```
composer-rest-server
```

For more info check out https://hyperledger.github.io/composer/tutorials/developer-tutorial.html


# Decentralized emission trade market

Companies active in the Port of Rotterdam operate within a strict emission regulatory framework. This framework sets maximum allowed values per company for each of the emission types (CO2, NOX, SO2 etc.). The sum of the maximum allowed values per emission type /per company cannot exceed the total allowed emissions for the port region as a whole. For some of these emission types companies find it easier to stay below the threshold than for others, while for others it is much more difficult and would require extensive investment.

First step would be to develop a decentralized emission market that would allow companies to trade residual emission space with others, directly (1) or indirectly (2):

Bob has residual NOX emissions, but has reached his maximum allowed value of emissions for SO2. Alice on the other hand has residual SO2 emissions, but needs NOX. The system should provide Bob and Alice with the possibility to trade these emissions.

Bob has residual NOX emissions, but has reached his maximum allowed value of emissions for SO2. Alice only has residual CO2 emissions, but doesn’t need any other emissions. However, elsewhere in the network there’s John who needs additional CO2 emissions and has residual SO2 emissions. The system should provide Bob, Alice and John the possibility to be able to trade these emissions.

Note that there’s a very strict legal framework in place and that for the project to be of any value, aspects of this framework have to be taken into consideration in order for it to be of any actual value. Additional information about this framework and data will be made available to the students upon the start of the project.

The target of this project is to build a decentralized market which allows the companies to trade emission. The following design criterium should be taken into account:

The trading records should be transparent and traceable, and most importantly, fit into the legal framework.

The blockchain should have a very high reliability and security level. On the other hand, the throughput, latency, and storage requirements are relatively low.

A smart matchmaking scheme should also be designed, which allows not only 2-party trades, but also multi-party trading matches.
