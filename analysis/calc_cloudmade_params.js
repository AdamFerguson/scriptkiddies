
var prompt = require('prompt');
var math = require('mathjs');

prompt.get(['zoom', 'latitude', 'longitude'], function(err, result) {
  if (err) { return console.log(err); }
  var zoom = parseFloat(result.zoom);
  var latitude = 35.227087; //parseFloat(result.latitude);
  var longitude = -80.843127; //parseFloat(result.longitude);
  var lat_rad = (latitude * Math.PI) / 180;

  var n = math.pow(2, zoom);
  var xtile = ((longitude + 180) / 360) * n;
  var ytile = (1 - (math.log(math.tan(lat_rad) + math.sec(lat_rad)) / Math.PI)) / 2 * n;

  console.log("x coordinate is: " + xtile + " and y coordinate is: " + ytile);

  process.exit();
  return 1;
});


