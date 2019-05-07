var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
    app.use(express.static(__dirname + "/../client"));
    res.sendFile(path.join(__dirname + "/../client/index.html"));
});

app.get('/mongodb', function(req, res) {
    res.sendFile(path.join(__dirname + "/mongodb/connection.js"));
});

app.listen(6660);