Feature: Basic Trade Scenarios
    Background:
        Given I have deployed the business network definition ..
        And I have added the following participants
        """
        [
        {"$class":"org.emission.network.Company","companyID":"X","name":"Company X","ett":"org.emission.network.Ett#X"},
        {"$class":"org.emission.network.Company","companyID":"Y","name":"Company YX","ett":"org.emission.network.Ett#Y"}
        ]
        """
        And I have added the following Regulator of type org.emission.network.Regulator
            | regulatorID   |
            | R             |
        And I have issued the participant org.emission.network.Company#X with the identity companyX
        And I have issued the participant org.emission.network.Company#Y with the identity companyY
        And I have issued the participant org.emission.network.Regulator#R with the identity regulator
        And I have added the following asset of type org.emission.network.Ett
            | ettID | limit | owner                            | 
            | X     | 500   | org.emission.network.Company#X   |
            | Y     | 400   | org.emission.network.Company#Y   |
        And I submit the following transactions of type org.emission.network.Trade
            | buyer | seller |  emissionToTrade |
            | Y     | X      |  200             |
        When I use the identity companyY
    Scenario: When a sucessfull trade is done 
        When I use the identity companyY
        And I submit the following transaction of type org.acme.shipping.perishable.ShipmentReceived
            | buyer | seller |  emissionToTrade |
            | Y     | X      |  200             |
        Then I should have the following asset
        """
        [
        {"$class":"org.emission.network.Ett","ettID":"X", "limit": 300, "company":"org.emission.network.Company#X"},
        {"$class":"org.emission.network.Ett","ettID":"Y", "limit": 600, "company":"org.emission.network.Company#Y"}
        ]
        """