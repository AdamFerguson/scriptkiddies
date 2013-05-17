var Tract     = require('../models').Tract;
var streamable = require('../app').streamable;



exports.list = [streamable, function(req, res) {
  var lngLow  = -81.491089‎;
  var lngHigh = -80.158997‎;
  var latLow  = 34.817186;
  var latHigh =35.756543;
  var geojsonPoly = {
  type: 'Polygon',
  coordinates: [[
      [lngLow,latLow],
      [lngHigh,latLow],
      [lngHigh,latHigh],
      [lngLow,latHigh],
      [lngLow,latLow]
    ]]
  };
  Tract.find({loc: { $within: { $geometry: geojsonPoly }).stream({ transform: JSON.stringify }).pipe(res);
}];