const mongoose = require('mongoose');
const messageOK = "Collection structure saved";
const furnitureModels = require('./models/structure');
var furnitureModel = furnitureModels.furnitureModel;  

  exports.insertNewFurniture = (structure) =>{
    var newFurniture = new furnitureModel(structure);

    newFurniture.save(function (err) {
        if (err) return handleError(err);
        console.log(messageOK);
      });
  };