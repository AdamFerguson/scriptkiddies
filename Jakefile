var fs         = require('fs');
var csv        = require('csv');
var mongoose   = require('mongoose');

var Store      = require('./models').Store;
var Household  = require('./models').Household;

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

    Household.remove({}, function(err) {
      if (err) console.log(err);
      else {
        csv().
          from.path(__dirname+'/data/customer-data.csv', {columns: true}).
          on('record', function(row, index) {
            Household.findOne({householdId: row.HOUSEHOLD_NUM}, function(err,house) {
              if (err) console.log(err);
              else {
                if (house) {
                  if (house.segmentIds.indexOf(row.SEG_ID) == -1) house.segmentIds.push(row.SEG_ID);
                  house.transactions.push(createTransaction(row));
                  house.save(function(err) {
                    if (err) console.log(err);
                    else console.log(house);
                  });
                }
                else {
                  console.log(JSON.stringify(row));
                  house = new Household({
                    householdId: row.HOUSEHOLD_NUM,
                    loc: [row.HOUSE_LONGITUDE, row.HOUSE_LATITUDE],
                    segmentIds: [row.SEG_ID],
                    transactions: [createTransaction(row)]
                  });
                  house.save(function(err) {
                    if (err) console.log(err);
                    else console.log(house);
                  });
                }
              }
            });
          });
      }
    });
  });



});

function createTransaction(row) {
  return {
    storeId:     row.STORE,
    description: row.DESCRIPTION,
    netSales:    row.NET_SALES,
    date:        row.DATE 
  };
}