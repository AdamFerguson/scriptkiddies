var async      = require('async');
var csv        = require('csv');

var Household = require('../models').Household;

exports.importHouseholds = function() {
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
            loc: {type: 'Point', coordinates: [row.HOUSE_LONGITUDE, row.HOUSE_LATITUDE]},
            //loc: [row.HOUSE_LONGITUDE, row.HOUSE_LATITUDE],
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
        from.path(__dirname+'/../data/customer-data.csv', {columns: true}).
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
};
