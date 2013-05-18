var Tract     = require('../models').Tract;
var streamable = require('../app').streamable;

exports.list = [streamable, function(req, res) {

Tract.find().stream({transform: JSON.stringify}).pipe(res);
//Tract.find({loc:{coordinates: { $within: { $geometry: geojsonPoly }}}}).stream({ transform: JSON.stringify }).pipe(res);
  //Tract.searchByBounds(latHigh,lngHigh,latLow,lngLow).stream({ transform: JSON.stringify }).pipe(res);
}];
