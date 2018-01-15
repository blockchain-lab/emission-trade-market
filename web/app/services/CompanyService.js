app.factory('Company', function ($http, $cookieStore, roles){

    return {

        buy: function(body, success, error) {
            $http.post('http://localhost:3000/api/Buy', body).then(
                success,
                error
            );
        },

        sell: function(body, success, error) {
            $http.post('http://localhost:3000/api/Sell', body).then(
                success,
                error
            );
        }
    };
});