#!/usr/bin/python

import requests

LOCALHOST = "http://localhost:3000/api/"
MARKET_URL  = LOCALHOST + "Market"
COMPANY_URL = LOCALHOST + "Company" 
ETT_URL = LOCALHOST + "Ett" 
SELL_URL = LOCALHOST + "Sell"

marketSize = 3 # determins how many companies to be setup; each with one ett and does one sell transaction
marketID = 2

companies = [0] * marketSize
etts = [0] * marketSize
sells = [0] * marketSize
reqs = []


market = {
    "$class": "org.emission.network.Market",
    "marketID": str(marketID),
    "emission": 0,
    "etts": []
}

reqs.append((MARKET_URL, market))

for x in range(marketSize):
    ett = {
        "$class": "org.emission.network.Ett",
        "ettID": str(x),
        "emission": 0,
        "owner": "resource:org.emission.network.Company#" + str(x)
    }   
    company = {
        "$class": "org.emission.network.Company",
        "companyID": str(x),
        "name": "COMPANY NAME " + str(x),
        "marketID": str(marketID),
        "emissionConsumed": 0,
        "emissionLimit": 1000,
        "ett": "resource:org.emission.network.Ett#" + str(x)
    }
    etts[x] = ett
    companies[x] = company

    reqs.append((ETT_URL, ett))
    reqs.append((COMPANY_URL, company))

for x in range(marketSize): 
    sell = {
        "$class": "org.emission.network.Sell",
        "emission": 100,
        "sellerID": str(x)
    } 
    sells[x] = sell

    reqs.append((SELL_URL, sell))

for x in reqs:
    print "POST: " + str((x[0], x[1]))
    r = requests.post(x[0], x[1])
    print r

print "done" 
