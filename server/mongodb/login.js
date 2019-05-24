const mongoose = require('mongoose');
const connection = require('./connection.js');
const userModels = require('./models/user');
const structureList = require('./controllers/listStructure');
const bcrypt = require("bcrypt");

var userModel = userModels.userModel;
const messages = {
  errorPassword: "User password incorrect",
  errorEmail: "Email incorrect"
}
var saveUser = require("./saveUser.js");
  
  exports.login = (user, serverResponse) =>{
    userModel.find({email: user.email}, (err, res) => {
      if (err) return handleError(err);

      res.length < 1 ? allow(serverResponse, user) : checkPass(serverResponse, user);
    });
  };

  function allow(serverResponse, user){
    if(!validateEmail(user.email)){
      denyEmail(serverResponse);
    }else{
      saveUser.insertNewUser(user);
      structureList.load(user.email, (res) => {
        serverResponse.status(200).send(JSON.stringify(res)); //send user's models
      });
    }
  }

  function checkPass(serverResponse, user) {
    userModel.findOne({email: user.email}, 
      (err, res) => {
      if (err) return handleError(err);
      bcrypt.compare(user.password, res.password, function(err, res) {
        //if (err) return handleError(err);
        res? allow(serverResponse, user) : denyPass(serverResponse);
      });
    });
  }

  function denyPass(serverResponse){
    serverResponse.status(401).send(messages.errorPassword);
  }

  function denyEmail(serverResponse){
    serverResponse.status(400).send(messages.errorEmail);
  }

  function validateEmail(email){
    var valid = false;
    var regExp = /^([a-z]|[A-Z]|\.)*@([a-z]|[A-Z])*((.com)|(.org)|(.cat)|(.es))$/;
    
    if(regExp.test(email)){
        valid = true;
    }
    
    return valid;
  }