const mongoose = require('mongoose');
const connection = require('./connection.js');
const table = "users";
const messageOK = "Collection user saved";

  var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  });
  
  var userModel = mongoose.model(table, userSchema);
  
  exports.insertNewUser = (user) =>{
    var newUser = new userModel(user);

    newUser.save(function (err) {
        if (err) return handleError(err);
        console.log(messageOK);
      });
  };