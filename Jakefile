var fs       = require('fs');
var csv      = require('csv');
var mongoose = require('mongoose');

var Store    = require('./models').Store;

desc('Import the data');
task('import_data', function () {
  Store.remove({}, function(err) {
    if (err) console.log(err);
    else {
      csv().
        from.path(__dirname+'/data/store-data.csv', {columns: true}).
        on('record', function(row,index) {
          console.log(JSON.stringify(row));
          var store = new Store({storeId: row.STORE, loc: [row.LONGITUDE, row.LATITUDE]});
          store.save(function(err) {
            if (err) console.log(err);
          });
        });
    }
  });

});
