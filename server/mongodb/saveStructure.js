const mongoose = require('mongoose');
const messages = {
  insert: "Collection structure saved",
  update: "Collection structure updated"
}
const furnitureModels = require('./models/structure');
var furnitureModel = furnitureModels.furnitureModel;  

  exports.insertNewFurniture = (structure) =>{
    var newFurniture = new furnitureModel(structure);

    furnitureModel.findOne(
      { 
      slotId: structure.slotId,
      designer: structure.designer
     }, 
     (err, res) => {
      if (err) return handleError(err);

      res != undefined ? updateStructure(furnitureModel, structure, res._id) : createNewStructure(newFurniture);
    });
  };

  function createNewStructure(newFurniture){
    newFurniture.save(function (err) {
      if (err) return handleError(err);
      console.log(messages.insert);
    });
  }

  function updateStructure(furnitureModel, structure, mongoId){
    furnitureModel.updateOne(
      { 
        _id: mongoId
       },
      { $set: structure },
      function (err, res) {
        if (err) return handleError(err);
        console.log(messages.update);
        console.log(res);
      }
    );
  }