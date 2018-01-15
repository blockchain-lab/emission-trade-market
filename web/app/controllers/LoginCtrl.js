var loginCtrl = function ($scope, $location, $rootScope, ngDialog, Auth) {

    $rootScope.isLoggedin = false;

    $scope.openLoginDlg = function () {
        $rootScope.error = "";
        ngDialog.open({
            template: 'loginDlg',
            className: 'ngdialog-theme-default',
            controller: 'LoginCtrl'
        });
    };

    $scope.login = function () {

        $scope.dataLoading = true;
        Auth.login({
                username: $scope.username,
                password: $scope.password
            },
            function(res) {
                $rootScope.isLoggedin = true;
                $rootScope.username = res.username;
                ngDialog.closeAll();
                $location.path('/'+res.role);
            },
            function () {
                $rootScope.error = "Failed to login";
                $scope.dataLoading = false;
        });
    };

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/');
            $rootScope.isLoggedin = false;
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
};

app.controller('LoginCtrl', loginCtrl);