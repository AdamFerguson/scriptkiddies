var Tract     = require('../models').Tract;
var streamable = require('../app').streamable;

exports.list = [streamable, function(req, res) {
  Tract.find({}).stream().pipe(res);
}];