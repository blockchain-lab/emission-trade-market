app.factory('Regulator', function ($http){

    return {

        loadCompanies: function(success, error){
            $http.get('http://localhost:3000/api/Company').then(
                function (response) {
                    success(response.data);
                },
                error
            );
        },

        loadEtts: function(success, error){
            $http.get('http://localhost:3000/api/Ett').then(
                function (response) {
                    success(response.data);
                },
                error
            );
        },

        addCompany: function(body, success, error) {
            $http.post('http://localhost:3000/api/Company', body).then(
                function (response) {
                    success(response.data);
                },
                function (response) {
                    error(response);
                }
            );
            
        },

        addEtt: function(body, success, error) {
            $http.post('http://localhost:3000/api/Ett', body).then(
                function (response) {
                    success(response.data);
                },
                function (response) {
                    error(response);
                }
            );
        },

        update: function() {

        },

        delete: function(id, success, error) {
            $http.delete('http://localhost:3000/api/Company/'+id).then(
                function (response) {
                    success(response.data);
                },
                error
            );
        }

    };
});