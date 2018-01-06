var app = angular.module('DoxChainApp', ['ngCookies', 'ngRoute', 'ngDialog']);

app.config(['$routeProvider', 'roles', function ($routeProvider, roles) {

    $routeProvider
        .when('/regulator', {
            controller: 'MainCtrl',
            templateUrl: 'views/regulator.html',
            access: roles.regulator
        })

        .when('/company', {
            controller: 'MainCtrl',
            templateUrl: 'views/company.html',
            access: roles.company
        })

        .when('/', {
            controller: 'MainCtrl',
            templateUrl: 'views/home.html',
            access: roles.guest
        })
}]);

app.run(['$rootScope', '$location', 'Auth', 'roles', function ($rootScope, $location, Auth, roles){

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if(!Auth.isLoggedIn())
            $location.path("/");
        else
            $location.path("/" + Auth.getRole());
    });
}]);