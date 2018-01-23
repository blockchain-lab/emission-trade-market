var companyCtrl = function ($scope, $rootScope, Company) {

    var refresh = function () {
        Company.get_available(
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.available = res[0].emission;
                });
            },
            function () {

            });
        Company.get_limit(parseInt($rootScope.username).repalce(/[^0-9]/g,''),
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.limit  = res.emissionLimit;
                });
            },
            function () {

            });
        Company.get_onsale(parseInt($rootScope.username).repalce(/[^0-9]/g,''),
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.onsale  = res.emission;
                });
            },
            function () {

            });
    };

    refresh();

    

    $scope.buy = function () {
        Company.buy({
            $class: "org.emission.network.Buy",
            emission: $scope.buy_amount,
            buyerID: parseInt($rootScope.username).repalce(/[^0-9]/g,''),
            timestamp: "2018-01-16T00:12:59.401Z"
        },
        function() {
            refresh();
        },
        function () {
            
        });
    },

    $scope.sell = function () {

        console.debug("00000");
        Company.sell({
            $class: "org.emission.network.Sell",
            emission: $scope.sell_amount,
            sellerID: parseInt($rootScope.username).repalce(/[^0-9]/g,''),
            timestamp: "2018-01-16T00:12:59.401Z"
        },
        function() {
            refresh();
        },
        function () {
            
        });
    }
};

app.controller('CompanyCtrl', companyCtrl);