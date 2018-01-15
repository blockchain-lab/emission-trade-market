var companyCtrl = function ($scope, Company) {

    $scope.buy = function () {
        Company.buy({
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
            amount: $scope.sell_amount,
            companyID: $scope.sell_companyID
        },
        function() {
            
        },
        function () {
            
        });
    }
};

app.controller('CompanyCtrl', companyCtrl);