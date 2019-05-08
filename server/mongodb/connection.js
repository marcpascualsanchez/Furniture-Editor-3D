const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/furniture', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Furniture connection error:'));
db.once('open', function() {
  console.log("Connection done");
});