const connection = require('./connection.js');
const userModels = require('./models/user');
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
    var newUser = new userModel(user); //casting it to a 'mongoose doc'
    newUser.save(function (err) {
      if (err) return handleError(err);
    });
    console.log(messages.created);
  }

  function update(user){
    //if user was already in db
    console.log(messages.alreadyIn);
  }