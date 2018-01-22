var removed_id;
var removed_name = "";

var regulatorCtrl = function ($scope, $rootScope, $http, Regulator, ngDialog) {

    $scope.allAssets = [];

    function refreshPage(){
        Regulator.loadCompanies(
            function(res) {
                angular.extend($scope.allAssets, res);
                console.debug("load companies0");
            },
            function() {
                console.debug("load companies error");
            }
        );
    };

    refreshPage();

    $scope.refresh = function(){
        refreshPage();      
    },

    $scope.openAddEttDlg = function () {
        ngDialog.open({
            template: 'addEttDlg',
            className: 'ngdialog-theme-default',
            controller: 'RegulatorCtrl'
        });

    };

    $scope.openAddCompanyDlg = function () {
        ngDialog.open({
            template: 'addCompanyDlg',
            className: 'ngdialog-theme-default',
            controller: 'RegulatorCtrl'
        });
    };

    $scope.openUpdateDlg = function () {
        ngDialog.open({
            template: 'updateDlg',
            className: 'ngdialog-theme-default',
            controller: 'RegulatorCtrl'
        });
    };

    $scope.openDeleteDlg = function (id, name) {
        removed_id = id;
        removed_name = name;
        ngDialog.open({
            template: 'deleteDlg',
            className: 'ngdialog-theme-default',
            controller: 'RegulatorCtrl'
        });
    };

    $scope.addCompany = function () {
        Regulator.addCompany({
            $class: "org.emission.network.Company",
            companyID: $scope.companyID,
            name: $scope.companyName,
            emissionConsumed: 0,
            emissionLimit: $scope.limit,
            ett: "org.emission.network.Ett#"+$scope.ettID
        },
        function(res) {
            // $scope.$evalAsync(function (){
            //     $scope.allAssets.push(res);
            //     $scope.$apply();
            //     console.debug("load companies1 -pre:"+JSON.stringify($scope.allAssets));
            // });
            $scope.allAssets.push(res);
            console.debug("load companies1:"+JSON.stringify($scope.allAssets));
            $http.post('/adduser', {companyname: $scope.companyName});
            ngDialog.closeAll();
        },
        function (res) {
            console.debug("add company: error!");
        });
    };

    $scope.addEtt = function () {
        Regulator.addEtt({
            $class: "org.emission.network.Ett",
            ettID: $scope.add_ettID,
            emission: 0,
            owner: "org.emission.network.Company#"+$scope.owner
        },
        function(res) {
            ngDialog.closeAll();
        },
        function (res) {
            console.debug("add asset: error!");
        });

    };

    $scope.update = function () {

    };

    $scope.delete = function () {
        Regulator.delete(removed_id,
        function(res) {
            //TODO
            
            var i;
                for(i = 0; i < $scope.allAssets.length; i++){
                    if($scope.allAssets[i].companyID == removed_id) {
                        $scope.$evalAsync(function (){
                            $scope.allAssets.splice(i, 1);
                        });
                    }
                }
                console.debug("load companies2:"+JSON.stringify($scope.allAssets));
            $http.post('/deleteuser', {companyname: removed_name});
            ngDialog.closeAll();
        },
        function (res) {
            console.debug("delete: error!");
        });
    };
};

app.controller('RegulatorCtrl', regulatorCtrl);