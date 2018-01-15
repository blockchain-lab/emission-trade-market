var express = require('express'),
    util = require('util'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb');

var app = express();

var roles = {
    guest:     'guest',
    regulator: 'regulator',
    company:   'company'
};

var users = [
    {username: 'admin', password: '123', role: 'regulator'},
    {username: 'user1', password: '123', role: 'company'},
    {username: 'user2', password: '123', role: 'company'}];

//app
app.listen(8080);

// Require body-parser (to receive post data from clients)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/app', express.static(__dirname + '/app'));

app.get('/', function(req, res) {
    res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.post('/adduser', function (req, res) {
    mongo.MongoClient.connect('mongodb://admin:123@ds251807.mlab.com:51807/doxchain', function(err, db) {

        // ... start the server
        if (err) return console.log(err);

        var col = db.collection('users');
        col.insert([{username: req.body.companyname, password: '123', role: 'company'}], function(error, result){});
        db.close();
    });
});

app.post('/deleteuser', function (req, res) {
    mongo.MongoClient.connect('mongodb://admin:123@ds251807.mlab.com:51807/doxchain', function(err, db) {

        // ... start the server
        if (err) return console.log(err);

        var col = db.collection('users');
        col.deleteMany({ username: req.body.companyname }, function(err, res){});
        db.close();
    });
});

app.post('/', function (req, res) {
    var role = roles.guest, username = '';

    //console.log(util.inspect(req.body));

    mongo.MongoClient.connect('mongodb://admin:123@ds251807.mlab.com:51807/doxchain', function(err, db) {

        if (err) return console.log(err);

        var col = db.collection('users');
        col.find({username: req.body.username, password: req.body.password}).toArray(function (err, docs){

            if(docs.length > 0) {
                username = docs[0].username;
                role = docs[0].role;

                res.cookie('user', JSON.stringify({
                    'username': username,
                    'role': role
                }));

                console.log(JSON.stringify({username: username, role: role}));
                res.send({username: username, role: role});
            }else{
                res.status(500).send();
            }
            db.close();
        });
    });
});