var Household = require('../models').Household;

exports.list = function(req, res){
  Household.find({}, function(err,houses) {
    if (err) res.status(500).send();
    else {
      res.send(houses);
    }
  });
};
