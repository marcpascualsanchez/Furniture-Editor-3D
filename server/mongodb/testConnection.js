const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodeTest', {useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection done");
});

var friendSchema = new mongoose.Schema({
  name: String
});

friendSchema.methods.speak = function () {
  var hello = this.name
  ? "Hola, mi nombre es " + this.name + " y soy de la Rodanxa."
  : "No tengo nombre...";

  console.log(hello);
}

var friend = mongoose.model('friend', friendSchema);

var Alex = new friend({ name: 'Alex' });

friend.find(function (err, friends) {
  if (err) return console.error(err);
  
  for(var i = 0; i < friends.length; i++){
    console.log(friends[i].name + " dice: ");
    friends[i].speak();
  }
})