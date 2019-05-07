var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
    app.use(express.static(__dirname));
    res.sendFile(path.join(__dirname + '/index.html'));
    
    //res.send("Hello world v5");
});

app.listen(6660);