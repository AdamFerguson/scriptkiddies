var Store = require('../models').Store;
var Household = require('../models').Household;

var lngLow  = -80.8;
var lngHigh = -80.75;
var latLow  = 35.3;
var latHigh = 35.4;
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

console.log(geojsonPoly);


Store.find({loc: { $within: { $geometry: geojsonPoly }}}, function (err, store) {
  if (err) console.log(err);
  else console.log(store);

});

// Household.find(
//   { loc :
//     { $near :
//       { $geometry:
//         { type: 'Point', coordinates: [ -80.9690466922475, 35.3261101803714 ] }
//       }
//       , $maxDistance: 1500
//     }
//   },
//   function(err, results) {
//     console.log(err,results);
//   });
