const mongoose = require('mongoose');
const table = "users";

var userSchema = new mongoose.Schema({
    email: String,
    password: String
  });
  
var userModel = mongoose.model(table, userSchema);
exports.userModel = userModel;