var Tract     = require('../models').Tract;
var streamable = require('../app').streamable;

exports.list = [streamable, function(req, res) {
  var lngLow  = -81.491089;
  var lngHigh = -80.158997;
  var latLow  = 34.817186;
  var latHigh = 35.756543;
  //Tract.searchByBounds(latHigh,lngHigh,latLow,lngLow).stream({ transform: JSON.stringify }).pipe(res);
  Tract.find({}, {tractId: 1, loc: 1}).stream({ transform: JSON.stringify }).pipe(res);
  /*var geojsonPoly = { type: 'Polygon', coordinates: [[
    [lngLow, latLow],
    [lngHigh, latLow],
    [lngHigh, latHigh],
    [lngLow, latHigh],
    [lngLow, latLow]
  ]]};
  // returns a query object that you can treat like a promise, or stream
  return Tract.find({
  	loc: { 
  		$geoIntersects: { 
  			$geometry: geojsonPoly 
  		}}
  	}, undefined, { batchSize: 1000}).stream({transform: JSON.stringify}).pipe(res);
  */
}];
