const structures = require('../models/structure');

exports.load = (mail, callBack) => {
  let condition = {designer: mail};
  
  structures.furnitureModel.find(condition, (err, res) => {
      if (err) return handleError(err);
      callBack(res);
    });
  };
