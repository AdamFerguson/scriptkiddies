var Tract     = require('../models').Tract;

exports.list = function(req, res) {
  Tract.find({}, function(err,tracts) {
    if (err) res.status(500).send(err);
    else {
      res.send(tracts);
    }
  });
};