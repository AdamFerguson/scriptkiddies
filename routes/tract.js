var Tract     = require('../models').Tract;
var streamable = require('../app').streamable;

exports.list = [streamable, function(req, res) {
  Tract.find({}, {tractId: 1, loc: 1, totalPopulations: 1, area: 1}).stream({ transform: JSON.stringify }).pipe(res);
}];

exports.show = [streamable, function(req, res) {
	Tract.findOne({tractId: req.params.tractId}).stream({transform: JSON.stringify}).pipe(res);
}];