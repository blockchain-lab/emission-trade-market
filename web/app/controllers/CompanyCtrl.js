var companyCtrl = function ($scope, Company) {

    $scope.buy = function () {
        Company.buy({
            $class: "org.emission.network.Buy",
            amount: $scope.buy_amount,
            companyID: $scope.buy_id
        },
        function() {
            
        },
        function () {
            
        });
    },

    $scope.sell = function () {
        Company.sell({
            $class: "org.emission.network.Sell",
            emission: $scope.sell_amount,
            sellerID: $scope.sell_companyID
        },
        function() {
            
        },
        function () {
            
        });
    }
};

app.controller('CompanyCtrl', companyCtrl);