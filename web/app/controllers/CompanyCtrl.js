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
        Company.get_limit($rootScope.username.split('user')[1],
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.limit  = res.emissionLimit;
                });
            },
            function () {

            });
        Company.get_onsale($rootScope.username.split('user')[1],
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
            buyerID: $rootScope.username.split('user')[1],
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
            sellerID: $rootScope.username.split('user')[1],
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