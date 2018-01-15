app.factory('Company', function ($http, $cookieStore, roles){

    return {

        buy: function(body, success, error) {
            $http.post('/', body).then(
                success,
                error
            );
        },

        sell: function(body, success, error) {
            $http.post('/', body).then(
                success,
                error
            );
        }
    };
});