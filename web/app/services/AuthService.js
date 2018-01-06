app.factory('Auth', function ($http, $cookieStore, roles){

    var currentUser = $cookieStore.get('user') || { username: '', role: roles.guest };

    $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        getRole: function () {
            return currentUser.role;
        },

        login: function(user, success, error) {
            $http.post('/', user).then(
                function (user) {
                    changeUser(user.data);
                    success(user.data);},
                error
            );
        },

        isLoggedIn: function (user) {
            if(user === undefined)
                user = currentUser;
            return user.role === roles.company || user.role === roles.regulator;
        },

        logout: function (success, error) {
            /*$http.post('/logout').then(
                function(){
                    changeUser({
                        username: '',
                        role: roles.guest
                    });
                    success();
                },
                error
            );*/
            changeUser({
                username: '',
                role: roles.guest
            });
            success();
        },

        user: currentUser
    };
});