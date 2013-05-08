var Household = require('../models').Household;

exports.list = function(req, res){
  Household.find({}, function(err,houses) {
    if (err) res.status(500).send(err);
    else {
      res.send(houses);
    }
  });
};

exports.byStoreId = function(req, res) {
  Household.find({'transactions.storeId': req.params.storeId}, function(err, houses) {
    if (err) res.status(500).send(err);
    else {
      res.send(houses);
    }
  });
};
