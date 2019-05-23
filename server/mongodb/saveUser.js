const connection = require('./connection.js');
const userModels = require('./models/user');
const bcrypt = require("bcrypt");
const saltRounds = 10;
var userModel = userModels.userModel;

const messages = {
  created: "Collection user created and saved",
  alreadyIn: "Collection user already in DB"
}
  
  exports.insertNewUser = (user) =>{
    userModel.countDocuments({email: user.email}, (err, res) => {
      if (err) return handleError(err);
      
      res <= 0 ? insert(user) : update(user);
    });
  };

  function insert(user){
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      if (err) return handleError(err);

      var newUser = new userModel({
        email: user.email,
        password: hash
      }); //casting it to a 'mongoose doc'
      newUser.save(function (err) {
        if (err) return handleError(err);
      });
      console.log(messages.created);
    });
  }

  function update(user){
    //if user was already in db
    console.log(messages.alreadyIn);
  }