var Household = require('../models').Household;
var streamable = require('../app').streamable;

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

exports.searchByBounds = [streamable, function(req, res) {
  console.log(req.query);
  var neLat = parseFloat(req.query.neLat);
  var neLng = parseFloat(req.query.neLng);
  var swLat = parseFloat(req.query.swLat);
  var swLng = parseFloat(req.query.swLng);
  Household.searchByBounds(neLat,neLng,swLat,swLng).stream().pipe(res); /*exec(function(err,results) {
    if (err) res.status(500).send(err);
    else {
      res.send(results);
    }
  });*/
}];
