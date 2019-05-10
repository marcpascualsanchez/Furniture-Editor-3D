const mongoose = require('mongoose');
const connection = require('./connection.js');

  var furnitureSchema = new mongoose.Schema({
    rowHeights: [Number],
    colWidths: [Number],
    rowDepths: [Number],
    coverTypes: [[String]]
  });
  
  var furnitureModel = mongoose.model('structures', furnitureSchema);
  
  exports.insertNewFurniture = (structure) =>{
    var newFurniture = new furnitureModel(structure);

    newFurniture.save(function (err) {
        if (err) return handleError(err);
        console.log("done danone");
      });
  };