var mainControllers = function ($scope, $location, ngDialog, AuthenticationService) {
    // reset login status
    //AuthenticationService.ClearCredentials();

    $scope.openLoginDlg = function () {
        ngDialog.open({
            template: 'loginDlg',
            className: 'ngdialog-theme-default',
            controller: 'MainCtrl'
        });
    };

    $scope.login = function () {
        $scope.dataLoading = true;

        AuthenticationService.Login($scope.username, $scope.password, function(response) {
            if(response.success) {
                AuthenticationService.SetCredentials($scope.username, $scope.password);
                ngDialog.closeAll();
                // $location.path('/');
            } else {
                $scope.error = response.message;
                $scope.dataLoading = false;
            }
        });
    };
};

app.controller('MainCtrl', mainControllers);