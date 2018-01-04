var app = angular.module('DoxChainApp', ['ngCookies', 'ngRoute', 'ngDialog']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        /*.when('/login', {
            controller: 'MainController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })*/

        .when('/', {
            controller: 'MainController',
            templateUrl: 'views/home.html'
        })

        .otherwise({ redirectTo: '/' });
}]);

/*app.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http){
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }
    });
}]);*/