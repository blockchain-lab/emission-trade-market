var temp = [];
var removed_id;
var removed_name = "";
var isDeleteCalled = false;

var regulatorCtrl = function ($scope, $rootScope, $http, Regulator, ngDialog) {

    $scope.allAssets = [];

    function refreshPage(){
        Regulator.loadCompanies(
            function(res) {
                $scope.allAssets = res;
            },
            function() {
                console.debug("load companies error");
            }
        );
    };

    refreshPage();

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

    $scope.refresh = function () {
        console.debug("temp1 :"+JSON.stringify(temp));
        $scope.allAssets = $scope.allAssets.concat(temp);
        temp = [];     

        if(isDeleteCalled) {
            var i;
            for(i = 0; i < $scope.allAssets.length; i++){
                if($scope.allAssets[i].companyID == removed_id) {
                    $scope.allAssets.splice(i, 1);
                }
            }
            isDeleteCalled = !isDeleteCalled;
        }
    },

    $scope.addCompany = function () {
        Regulator.addCompany({
            $class: "org.emission.network.Company",
            companyID: $scope.companyID,
            name: $scope.companyName,
            ett: "org.emission.network.Ett#"+$scope.ettID
        },
        function(res) {
            temp.push(res);
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
            limit: $scope.limit,
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
            isDeleteCalled = true;
            $http.post('/deleteuser', {companyname: removed_name});
            ngDialog.closeAll();
        },
        function (res) {
            console.debug("delete: error!");
        });
    };
};

app.controller('RegulatorCtrl', regulatorCtrl);