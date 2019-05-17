var express = require('express');
var parser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var app = express();

var saveStructure = require("./mongodb/saveStructure.js");
var login = require("./mongodb/login.js");

app.get('/', function(req, res) {
    app.use(express.static(__dirname + "/../client"));
    res.sendFile(path.join(__dirname + "/../client/index.html"));
});

app.use(parser.json('application/json'));
app.post('/saveStructure', function(req, res) {
    saveStructure.insertNewFurniture(req.body, res);
    res.status(200).send("Structure data recieved");
});

app.post('/login', function(req, res) {
    login.login(req.body, res);//responses are handled by /mongodb/login.js
});

app.listen(8080);

app.use(favicon(__dirname + '/img/favicon.ico'));