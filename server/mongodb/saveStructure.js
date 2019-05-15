const mongoose = require('mongoose');
const connection = require('./connection.js');
const table = "structures";
const messageOK = "Collection structure saved";

  var furnitureSchema = new mongoose.Schema({
    height: Number,
    width: Number,
    rowHeights: [Number],
    colWidths: [Number],
    rowDepths: [Number],
    coverTypes: [[String]]
  });
  
  var furnitureModel = mongoose.model(table, furnitureSchema);
  
  exports.insertNewFurniture = (structure) =>{
    var newFurniture = new furnitureModel(structure);

    newFurniture.save(function (err) {
        if (err) return handleError(err);
        console.log(messageOK);
      });
  };