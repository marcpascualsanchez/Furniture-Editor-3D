var express = require('express');
var parser = require('body-parser');
var path = require('path');
var app = express();

var saveStructure = require("./mongodb/saveStructure.js");
var saveUser = require("./mongodb/saveUser.js");

app.get('/', function(req, res) {
    app.use(express.static(__dirname + "/../client"));
    res.sendFile(path.join(__dirname + "/../client/index.html"));
});

app.use(parser.json('application/json'));
app.post('/saveStructure', function(req, res) {
    saveStructure.insertNewFurniture(req.body);
    res.send("Structure data recieved");
});

app.post('/saveUser', function(req, res) {
    saveUser.insertNewUser(req.body);
    res.send("User data recieved");
});

app.listen(8080);