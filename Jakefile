var fs         = require('fs');
var csv        = require('csv');
var mongoose   = require('mongoose');
var async      = require('async');

var Store      = require('./models').Store;
var Household  = require('./models').Household;

desc('Import the stores');
task('import_stores', function () {
  Store.remove({}, function(err) {
    if (err) console.log(err);
    else {
      csv().
        from.path(__dirname+'/data/store-data.csv', {columns: true}).
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

});


desc('Import the households');
task('import_households', function () {
  var houseRows = [];

  function processRows(row, done) {
    Household.findOne({householdId: row.HOUSEHOLD_NUM}, function(err,house) {
      if (err) console.log(err);
      else {
        if (house) {
          house.transactions.push(createTransaction(row));
          house.save(function(err) {
            if (err) console.log(err);
            else console.log(house);
            done();
          });
        }
        else {

          house = new Household({
            householdId: row.HOUSEHOLD_NUM,
            loc: [row.HOUSE_LONGITUDE, row.HOUSE_LATITUDE],
            transactions: [createTransaction(row)]
          });
          house.save(function(err) {
            if (err) console.log(err);
            else console.log(house);
            done();
          });
        }
      }
    });
  }

  Household.remove({}, function(err) {
    if (err) console.log(err);
    else {
      csv().
        from.path(__dirname+'/data/customer-data.csv', {columns: true}).
        on('record', function(row, index) {
          houseRows.push(row);

        }).on('end', function() {
          async.eachLimit(houseRows,1,processRows, function(err) {
            if (err) console.log(err);
            console.log('done');
            process.exit();
          });
        });

    }
  });
});

function createTransaction(row) {
  return {
    storeId:     parseInt(stripWhitespace(row.STORE), 10),
    description: stripWhitespace(row.DESCRIPTION),
    netSales:    parseFloat(row.NET_SALES),
    date:        new Date(stripWhitespace(row.DATE)),
    segmentId:   parseInt(row.SEG_ID, 10)
  };
}

function stripWhitespace(string) {
  return string.replace(/^\s+/, '').replace(/\s\s*$/, '');
}
