var companyCtrl = function ($scope, $rootScope, Company) {

    var refresh = function () {
        Company.get_available(
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.available = res[0].emission;
                    $scope.loading_available = false;

                });
            },
            function () {

            });
        Company.get_limit(parseInt($rootScope.username.replace(/[^0-9]/g,'')),
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.limit  = res.emissionLimit;
                    $scope.loading_limit = false;
                
                });
            },
            function () {

            });
        Company.get_onsale(parseInt($rootScope.username.replace(/[^0-9]/g,'')),
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.onsale  = res.emission;
                    $scope.loading_onsale = false;
                });
            },
            function () {

            });
    };

    refresh();

    

    $scope.buy = function () {
        $scope.loading_available = true;
        $scope.loading_onsale = true;
        $scope.loading_limit = true;
        Company.buy({
            $class: "org.emission.network.Buy",
            emission: $scope.buy_amount,
            buyerID: parseInt($rootScope.username.replace(/[^0-9]/g,'')),
            timestamp: "2018-01-16T00:12:59.401Z"
        },
        function() {
            refresh();
        },
        function () {
            
        });
    },

    $scope.sell = function () {

        $scope.loading_available = true;
        $scope.loading_onsale = true;
        $scope.loading_limit = true;
        Company.sell({
            $class: "org.emission.network.Sell",
            emission: $scope.sell_amount,
            sellerID: parseInt($rootScope.username.replace(/[^0-9]/g,'')),
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