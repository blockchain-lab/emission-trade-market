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

        /*login: function (user, success, error) {
            var response = { success: user.username === 'test' && user.password === 'test' };
            if(!response.success) {
                response.message = 'Username or password is incorrect';
            }else{
                changeUser({ username: 'test', role: roles.company });
                success(roles.company);
            }

        },*/

        login: function(user, success, error) {
            $http.post('/', user).then(
                function (user) {
                    console.debug(JSON.stringify(user.data));
                    changeUser(user.data);
                    success(user.data.role);},
                error
            );
        },

        isLoggedIn: function (user) {
            if(user === undefined)
                user = currentUser;
            return user.role === roles.company || user.role === roles.regulator;
        },

        user: currentUser
    };
});