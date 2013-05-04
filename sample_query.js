var Store = require('./models').Store;

var lngLow  = -80.8;
var lngHigh = -80.75;
var latLow  = 35.3;
var latHigh = 35.4;
var geojsonPoly = { type: 'Polygon', coordinates: [[[lngLow,latLow], [lngLow,latHigh], [lngHigh,latLow], [lngHigh,latHigh]]] };


Store.find({loc: { $within: { $geometry: geojsonPoly }}}, function (err, store) {
  if (err) console.log(err);
  else console.log(store);
});
