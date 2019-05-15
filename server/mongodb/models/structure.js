const mongoose = require('mongoose');
const table = "structures";

var furnitureSchema = new mongoose.Schema({
    height: Number,
    width: Number,
    rowHeights: [Number],
    colWidths: [Number],
    rowDepths: [Number],
    coverTypes: [[String]]
  });
  
  var furnitureModel = mongoose.model(table, furnitureSchema);
  exports.furnitureModel = furnitureModel;