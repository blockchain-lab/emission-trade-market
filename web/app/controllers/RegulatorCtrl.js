var regulatorCtrl = function ($scope, ngDialog) {

    $scope.allAssets = [{"companyID": "user1", "limit": "1000"},{"companyID": "user2", "limit": "2000"}]

    $scope.openAddAssetsDlg = function () {
        ngDialog.open({
            template: 'addAssetsDlg',
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

    $scope.openDeleteDlg = function () {
        ngDialog.open({
            template: 'deleteDlg',
            className: 'ngdialog-theme-default',
            controller: 'RegulatorCtrl'
        });
    };
};

app.controller('RegulatorCtrl', regulatorCtrl);