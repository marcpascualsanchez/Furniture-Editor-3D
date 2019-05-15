const mongoose = require('mongoose');
const connection = require('./connection.js');
const userModels = require('./models/user');
const structureList = require('./controllers/listStructure');

var userModel = userModels.userModel;

const messages = {
  error: "User password incorrect"
}
  
  exports.login = (user, serverResponse) =>{
    userModel.find(user, (err, res) => {
      if (err) return handleError(err);

      res.length > 0 ? allow(serverResponse, user.email) : deny(serverResponse);
    });
  };

  function allow(serverResponse, email){
    //serverResponse.status(200).send("Login correct");
    structureList.load(email, (res) => {
        serverResponse.status(200).send(JSON.stringify(res)); //send current models
    });
    return true;
  }

  function deny(serverResponse){
    serverResponse.status(401).send("Password incorrect");
    return false;
  }