const mongoose = require('mongoose');
const connection = require('./connection.js');
const userModels = require('./models/user');
var userModel = userModels.userModel;

const messages = {
  error: "User password incorrect"
}
  
  exports.login = (user, serverResponse) =>{
    userModel.find(user, (err, res) => {
      if (err) return handleError(err);
      
      res.length > 0 ? allow(serverResponse) : deny(serverResponse);
    });
  };

  function allow(serverResponse){
    serverResponse.status(200).send("Login correct");
    //serverResponse.status(200).send(loadModels()); //send current models
    return true;
  }

  function deny(serverResponse){
    serverResponse.status(401).send("Password incorrect");
    return false;
  }