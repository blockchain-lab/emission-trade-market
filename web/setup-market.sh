#!/bin/bash

echo "add market: east"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Market","marketID": "east","emission": 0,"etts": []}' http://localhost:3000/api/Market

echo "add market: west"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Market","marketID": "west","emission": 0,"etts": []}' http://localhost:3000/api/Market

echo "add company: ArrowPlus"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "sh24so453c", "name": "ArrowPlus", "marketID": "east", "emissionConsumed": 0, "emissionLimit": 1000, "ett": "org.emission.network.Ett#sh24so453c"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "sh24so453c", "emission": 0, "owner": "org.emission.network.Company#sh24so453c"}' http://localhost:3000/api/Ett

echo "add company: Cargolift"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "sh24so453c", "name": "ArrowPlus", "marketID": "east", "emissionConsumed": 0, "emissionLimit": 1000, "ett": "org.emission.network.Ett#sh24so453c"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "sh24so453c", "emission": 0, "owner": "org.emission.network.Company#sh24so453c"}' http://localhost:3000/api/Ett

echo "add company: Tigers"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "sh24so453c", "name": "ArrowPlus", "marketID": "east", "emissionConsumed": 0, "emissionLimit": 1000, "ett": "org.emission.network.Ett#sh24so453c"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "sh24so453c", "emission": 0, "owner": "org.emission.network.Company#sh24so453c"}' http://localhost:3000/api/Ett

echo "add company: BSR"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "sh24so453c", "name": "ArrowPlus", "marketID": "east", "emissionConsumed": 0, "emissionLimit": 1000, "ett": "org.emission.network.Ett#sh24so453c"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "sh24so453c", "emission": 0, "owner": "org.emission.network.Company#sh24so453c"}' http://localhost:3000/api/Ett

echo "add company: TANKCON"
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Company", "companyID": "sh24so453c", "name": "ArrowPlus", "marketID": "east", "emissionConsumed": 0, "emissionLimit": 1000, "ett": "org.emission.network.Ett#sh24so453c"}' http://localhost:3000/api/Company
curl -H "Content-Type:application/json" -X POST --data '{"$class": "org.emission.network.Ett", "ettID": "sh24so453c", "emission": 0, "owner": "org.emission.network.Company#sh24so453c"}' http://localhost:3000/api/Ett