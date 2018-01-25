#!/usr/bin/python

import requests

LOCALHOST = "http://localhost:3000/api/"
MARKET_URL  = LOCALHOST + "Market"
COMPANY_URL = LOCALHOST + "Company" 
ETT_URL = LOCALHOST + "Ett" 
SELL_URL = LOCALHOST + "Sell"

marketSize = 3 # determins how many companies to be setup; each with one ett and does one sell transaction
marketID = 1

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
    companies[x] = {
        "$class": "org.emission.network.Company",
        "companyID": str(x),
        "name": "COMPANY NAME " + str(x),
        "marketID": str(marketID),
        "emissionConsumed": 0,
        "emissionLimit": 1000,
        "ett": "resource:org.emission.network.Ett#" + str(x)
    }
    reqs.append((COMPANY_URL, companies[x]))

for x in range(marketSize):
    etts[x] = {
        "$class": "org.emission.network.Ett",
        "ettID": str(x),
        "emission": 0,
        "owner": "resource:org.emission.network.Company#" + str(x)
    }
    reqs.append((ETT_URL, etts[x]))

for x in range(marketSize):
    sells[x] = {
        "$class": "org.emission.network.Sell",
        "emission": 100,
        "sellerID": str(x)
    }
    reqs.append((SELL_URL, sells[x]))

for x in reqs:
    print "POST: " + str((x[0], x[1]))
    requests.post(x[0], x[1])

print "done" 
