var mongojs = require('mongojs');

var db = mongojs('scriptkiddies', ['households', 'stores']);

db.households.aggregate(
  { $project: { householdId: 1, transactions: 1}},
  { $unwind: "$transactions"},
  { $group : { _id : '$householdId', salesPerHouse : { $sum : "$transactions.netSales" } } },
  function(err, docs) {
    if (err) console.log(err);
    // else console.log(docs);

    // process.exit();
  });

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

suite.add('aggregate through iteration in javascript', function() {
  db.households.find(function(err,houses) {
    var filteredHouses = houses.filter(function(house) {
      return (house.segmentIds.length > 1);
    }).map(function(house) { return house.householdId; });
    console.log(filteredHouses.length);
  });
}).add('aggregate through native mongo aggregation framework', function() {
  db.households.aggregate(
    {$unwind: "$segmentIds" },
    {$group: {_id: "$householdId", segmentsPerHouse: {$sum: 1}}},
    {$match: { segmentsPerHouse: { $gt: 1 } }},
    {$sort: { segmentsPerHouse: 1 }},
    function(err, docs) {
      if (err) console.log(err);
      else {
        console.log(docs.length);
      }
    });
}).on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  process.exit();
}).run({ async: true});


