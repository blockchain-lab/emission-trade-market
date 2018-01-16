var available;
var limit;
var onsale;

var companyCtrl = function ($scope, $rootScope, Company) {

    {
        Company.get_available(
            function(res) {
                available = res[0].emission;
            },
            function () {
            
        });
        Company.get_limit($rootScope.username.split('user')[1],
        function(res) {
            limit = res.emissionLimit;
        },
        function () {
        
        });
        Company.get_onsale($rootScope.username.split('user')[1],
        function(res) {
            onsale = res.emission;
        });
    };

    $scope.buy = function () {
        Company.buy({
            $class: "org.emission.network.Buy",
            emission: $scope.buy_amount,
            buyerID: $rootScope.username.split('user')[1],
            timestamp: "2018-01-16T00:12:59.401Z"
        },
        function() {
            Company.get_available(
                function(res) {
                    available = res[0].emission;
                },
                function () {
                
            });
            Company.get_limit($rootScope.username.split('user')[1],
            function(res) {
                limit = res.emissionLimit;
            },
            function () {
            
            });
            Company.get_onsale($rootScope.username.split('user')[1],
            function(res) {
                onsale = res.emission;
            },
            function () {
            
            });
        },
        function () {
            
        });
    },

    $scope.sell = function () {
        Company.sell({
            $class: "org.emission.network.Sell",
            emission: $scope.sell_amount,
            sellerID: $rootScope.username.split('user')[1],
            timestamp: "2018-01-16T00:12:59.401Z"
        },
        function() {
            Company.get_available(
                function(res) {
                    available = res[0].emission;
                },
                function () {
                
            });
            Company.get_limit($rootScope.username.split('user')[1],
            function(res) {
                limit = res.emissionLimit;
            },
            function () {
            
            });
            Company.get_onsale($rootScope.username.split('user')[1],
            function(res) {
                onsale = res.emission;
            },
            function () {
            
            });
        },
        function () {
            
        });
    },

    $scope.refresh = function () {
        $scope.available = available;
        $scope.limit = limit;
        $scope.onsale = onsale;
    }
};

app.controller('CompanyCtrl', companyCtrl);