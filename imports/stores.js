var csv        = require('csv');

var Store = require('../models').Store;

exports.importStores = function() {
  Store.remove({}, function(err) {
    if (err) console.log(err);
    else {
      csv().
        from.path(__dirname+'/../data/store-data.csv', {columns: true}).
        on('record', function(row,index) {
          console.log(JSON.stringify(row));
          var store = new Store({
            storeId: row.STORE,
            loc: [row.LONGITUDE, row.LATITUDE],
            foursquareVenueId: row.FOURSQUARE_ID
          });
          store.save(function(err) {
            if (err) console.log(err);
          });
        }).on('end', function() {
          process.exit();
        });
    }
  });
};
