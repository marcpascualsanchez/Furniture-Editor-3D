const mongoose = require('mongoose');
const host = "localhost";
const port = "27017";
const database = "furniture";

connect = (host, port, database) => {
  var db;
  
  mongoose.connect("mongodb://" + host + ":" + port + "/" + database, {useNewUrlParser: true});

  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection ERROR'));
  db.once('open', function() {
    console.log("Connection OK");
  });
}

connect(host, port, database);