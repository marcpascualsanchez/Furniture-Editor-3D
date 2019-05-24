const mongoose = require('mongoose');
const connection = require('./connection.js');
const userModels = require('./models/user');

var userModel = userModels.userModel;
const messages = {
  errorEmail: "Email not found",
  valid: "Haga el login con una contraseña nueva"
}
var user = require("./saveUser.js");
  
  exports.forgotPassword = (userEmail, serverResponse) =>{
    userModel.find(userEmail, (err, res) => {
      if (err) return handleError(err);

      res.length > 0 ? allow(serverResponse, userEmail) : denyEmail(serverResponse);
    });
  };

  function allow(serverResponse, userEmail){
    user.deleteUser(userEmail);
    serverResponse.status(200).send(messages.valid);
  }

  function denyEmail(serverResponse){
    serverResponse.status(400).send(messages.errorEmail);
  }