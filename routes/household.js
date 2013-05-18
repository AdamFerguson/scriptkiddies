var Household = require('../models').Household;
var Tract = require('../models').Tract;
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
  var neLat = parseFloat(req.query.neLat);
  var neLng = parseFloat(req.query.neLng);
  var swLat = parseFloat(req.query.swLat);
  var swLng = parseFloat(req.query.swLng);
  Household.searchByBounds(neLat,neLng,swLat,swLng).stream({transform: JSON.stringify}).pipe(res);
}];

exports.searchByTracts = [streamable, function(req, res) {
  var tractIds = req.query.tractIds.split(',').map(function(tractId) {
    return parseInt(tractId.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
  });
  Tract.where('tractId').in(tractIds).select({loc: 1}).exec(function(err, tracts) {
    var totalQueries = 0;
    
    // Mongo doesn't allow using $or logic on geospatial queries, DOH!
    tracts.forEach(function(tract) {
      var stream = Household.find({loc: { $within: { $geometry: tract.loc }}}).stream({transform: JSON.stringify});
      stream.pipe(res, {end: false});
      stream.on('end', function() {
        totalQueries++;
        if (totalQueries === tractIds.length) res.end();
      });
    });
  })
}];