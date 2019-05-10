var express = require('express');
var parser = require('body-parser');
var path = require('path');
var app = express();

var saveStructure = require("./mongodb/saveStructure.js");

app.get('/', function(req, res) {
    app.use(express.static(__dirname + "/../client"));
    res.sendFile(path.join(__dirname + "/../client/index.html"));
});

app.use(parser.json('application/json'));
app.post('/saveStructure', function(req, res) {
    //res.sendFile(path.join(__dirname + "/mongodb/saveStructure.js"));
    saveStructure.insertNewFurniture(req.body);
    res.send("Data recieved");
});

app.listen(80);