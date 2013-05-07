var Store = require('../models').Store;

exports.list = function(req, res){
  Store.find({}, function(err,stores) {
    if (err) res.status(500).send();
    else {
      res.send(stores);
    }
  });
};
