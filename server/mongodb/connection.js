const mongoose = require('mongoose');
const dbURI = "mongodb+srv://admin:admin@cluster0-gmhkc.mongodb.net/test?retryWrites=true";

connect = (dbURI) => {
  var db;
  
  mongoose.connect(dbURI, {useNewUrlParser: true});

  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection ERROR'));
  db.once('open', function() {
    console.log("Connection OK");
  });
}

connect(dbURI);