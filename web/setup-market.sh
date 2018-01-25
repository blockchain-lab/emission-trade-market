#!/bin/bash

echo "add market: east"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Market","marketID": "east","emission": 0,"etts": []}' http://localhost:3000/api/Market

echo "add market: west"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Market","marketID": "west","emission": 0,"etts": []}' http://localhost:3000/api/Market

echo "add company: ArrowPlus"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "sh24so453c", "name": "ArrowPlus", "marketID": "east", "emissionConsumed": 0, "emissionLimit": 1000, "ett": "org.emission.network.Ett#sh24so453c"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "sh24so453c", "emission": 0, "owner": "org.emission.network.Company#sh24so453c"}' http://localhost:3000/api/Ett

echo "add company: Cargolift"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "8rmc350dq1", "name": "Cargolift", "marketID": "east", "emissionConsumed": 0, "emissionLimit": 1300, "ett": "org.emission.network.Ett#8rmc350dq1"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "8rmc350dq1", "emission": 0, "owner": "org.emission.network.Company#8rmc350dq1"}' http://localhost:3000/api/Ett

echo "add company: Tigers"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "ov45iouyq3", "name": "Tigers", "marketID": "east", "emissionConsumed": 0, "emissionLimit": 1500, "ett": "org.emission.network.Ett#ov45iouyq3"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "ov45iouyq3", "emission": 0, "owner": "org.emission.network.Company#ov45iouyq3"}' http://localhost:3000/api/Ett

echo "add company: BSR"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "4583dfuj5d", "name": "BSR", "marketID": "west", "emissionConsumed": 0, "emissionLimit": 2000, "ett": "org.emission.network.Ett#4583dfuj5d"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "4583dfuj5d", "emission": 0, "owner": "org.emission.network.Company#4583dfuj5d"}' http://localhost:3000/api/Ett

echo "add company: TANKCON"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "l3ms7nf1oo", "name": "TANKCON", "marketID": "west", "emissionConsumed": 0, "emissionLimit": 800, "ett": "org.emission.network.Ett#l3ms7nf1oo"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "l3ms7nf1oo", "emission": 0, "owner": "org.emission.network.Company#l3ms7nf1oo"}' http://localhost:3000/api/Ett

mongo ds012345.mlab.com:56789/dbname -u "doxchain" -p "doxchain123"
echo "insert ArrowPlus into Users DB"
db.users.insert({"username": "ArrowPlus", "password": "123", "role": "company"})

echo "insert Cargolift into Users DB"
db.users.insert({"username": "Cargolift", "password": "123", "role": "company"})

echo "insert Tigers into Users DB"
db.users.insert({"username": "Tigers", "password": "123", "role": "company"})

echo "insert BSR into Users DB"
db.users.insert({"username": "BSR", "password": "123", "role": "company"})

echo "insert TANKCON into Users DB"
db.users.insert({"username": "TANKCON", "password": "123", "role": "company"})
