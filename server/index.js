var express = require('express');
var parser = require('body-parser');
var path = require('path');
var app = express();

var saveStructure = require("./mongodb/saveStructure.js");
var login = require("./mongodb/login.js");
var forgotPassword = require("./mongodb/forgotPassword.js");

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

app.post('/forgotPassword', function(req, res){
    forgotPassword.forgotPassword(req.body, res);//responses are handled by /mongodb/forgotPassword.js
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () =>{
    console.log("Server on port " + app.get('port') );
});