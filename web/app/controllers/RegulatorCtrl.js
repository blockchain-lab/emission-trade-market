var removed_id;
var removed_name = "";

var regulatorCtrl = function ($scope, $rootScope, $http, ngDialog) {

    $scope.allAssets = [];
    $scope.markets = [];
    $scope.currentMarket = "";

    function refreshPage(){
        $http.get('http://localhost:3000/api/Market').then(function (response) {
            angular.extend($scope.markets, response.data);
        });
        $http.get('http://localhost:3000/api/Company').then(function (response) {
            angular.extend($scope.allAssets, response.data);
        });
    };

    refreshPage();

    $scope.openAddCompanyDlg = function () {
        ngDialog.open({
            template: 'addCompanyDlg',
            className: 'ngdialog-theme-default',
            controller: 'RegulatorCtrl',
            scope: $scope
        });
    };

    $scope.openAddMarketDlg = function () {
        ngDialog.open({
            template: 'addMarketDlg',
            className: 'ngdialog-theme-default',
            controller: 'RegulatorCtrl',
            scope: $scope
        });
    };

    $scope.setCurrentView = function () {
        $scope.currentMarket = $scope.selectedMarket;
    };

    $scope.openDeleteDlg = function (id, name) {
        removed_id = id;
        removed_name = name;
        ngDialog.open({
            template: 'deleteDlg',
            className: 'ngdialog-theme-default',
            controller: 'RegulatorCtrl',
            scope: $scope
        });
    };

    $scope.addMarket = function () {
        $scope.loading_add2 = true;

        var body = {
            $class: "org.emission.network.Company",
            marketID: $scope.marketName2,
            emission: []
        };
        $http.post('http://localhost:3000/api/Market', body).then(

            function (response) {
                $scope.$parent.markets.push(response.data);
                $scope.$parent.loading_add2 = false;
                ngDialog.closeAll();
            });
    };

    $scope.addCompany = function () {
        $scope.loading_add = true;

        var body = {
            $class: "org.emission.network.Company",
            companyID: $scope.companyID,
            name: $scope.companyName,
            emissionConsumed: 0,
            emissionLimit: $scope.limit,
            ett: "org.emission.network.Ett#"+$scope.ettID
        };
        $http.post('http://localhost:3000/api/Company', body).then(

            function (response) {
                $scope.$parent.allAssets.push(response.data);
                $http.post('/adduser', {companyname: $scope.companyName});
                $scope.$parent.loading_add = false;
                ngDialog.closeAll();
        });
    };

    // $scope.addEtt = function () {
    //     var body = {
    //         $class: "org.emission.network.Ett",
    //         ettID: $scope.add_ettID,
    //         emission: 0,
    //         owner: "org.emission.network.Company#"+$scope.owner
    //     };
    //
    //     $http.post('http://localhost:3000/api/Ett', body).then(
    //         function () {
    //             ngDialog.closeAll();
    //         }
    //     );
    //
    // };

    $scope.delete = function () {

        $scope.loading_delete = true;

        $http.delete('http://localhost:3000/api/Company/'+removed_id).then(
            function (response) {
                var i;
                for(i = 0; i < $scope.allAssets.length; i++){
                    if($scope.allAssets[i].companyID == removed_id) {
                        $scope.$parent.allAssets.splice(i, 1);
                    }
                }
                $http.post('/deleteuser', {companyname: removed_name});
                $scope.loading_delete = false;
                ngDialog.closeAll();}
        );
    };
};

app.controller('RegulatorCtrl', regulatorCtrl);