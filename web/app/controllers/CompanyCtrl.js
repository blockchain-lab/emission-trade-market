var companyCtrl = function ($scope, $http, $rootScope, Company) {


    var refresh = function () {
        console.debug("compant id:"+JSON.stringify($scope.companyID));
        Company.get_available(
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.available = res[0].emission;
                    $scope.loading_available = false;

                });
            },
            function () {

            });
        Company.get_limit($scope.companyID,
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.limit  = res.emissionLimit;
                    $scope.loading_limit = false;
                
                });
            },
            function () {

            });
        Company.get_onsale($scope.companyID,
            function(res) {
                $scope.$evalAsync(function () {
                    $scope.onsale  = res.emission;
                    $scope.loading_onsale = false;
                });
            },
            function () {
            });
    };

    //get company ID first
    {
        console.debug("username="+$rootScope.username);
        $http.get('http://localhost:3000/api/queries/selectCompanyByName?name='+$rootScope.username).then(
            function(response){
                $scope.$evalAsync(function () {
                    console.debug('get id success:'+JSON.stringify(response));
                    $scope.companyID = response.data[0].companyID;
                    $scope.marketID = response.data[0].marketID;
                    refresh();
                });
                
            },
            function(response) {
                console.debug('get id error:'+JSON.stringify(response));
            }
        );
    }

    $scope.buy = function () {
        $scope.loading_available = true;
        $scope.loading_onsale = true;
        $scope.loading_limit = true;
        Company.buy({
            $class: "org.emission.network.Buy",
            emission: $scope.buy_amount,
            buyerID: $scope.companyID,
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
            sellerID: $scope.companyID,
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