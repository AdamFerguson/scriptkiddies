var Foursquare = require('./lib/foursquare');
var Store      = require('./models').Store;


Store.find({}, function(err, stores) {
  var totalStores = stores.length;
  var totalSoFar  = 0;

  stores.forEach(function(store) {
    /*
    var lat = store.loc[1];
    var lng = store.loc[0];
    var params = {query: 'Harris Teeter', radius: '1000'};

    Foursquare.Venues.search(lat, lng, null, params, null, function(err, res) {
      console.log("Results for StoreId " + store.storeId);
      console.log(res);

      totalSoFar++;
      if (totalSoFar === totalStores) process.exit();
    });
    */

    // Foursquare activity related to a particular venue over a period of time
    var startTime = (new Date('2012-01-01')).getTime() / 1000;
    // startAt represents the start of the time range in the number of seconds since
    // the epoch. In javascript, calling getTime() on a date object gives the number
    // of milliseconds since epoch. Foursquare also accepts an endAt param. When omitted,
    // the currentTime is assumed
    var params = {
      startAt: startTime,
      fields: 'totalCheckins, newCheckins, uniqueVisitors, sharing, genders, ages, hours'
    };

    Foursquare.Venues.getTimeseries(store.foursquareVenuId,params,null,function(err,res) {
      console.log(err, res);
    });
  });
});






