var mongojs = require('mongojs');

var db = mongojs('scriptkiddies', ['households', 'stores']);

db.households.find(function(err,houses) {
  var filteredHouses = houses.filter(function(house) {
    return (house.segmentIds.length > 1);
  }).map(function(house) { return house.householdId; });
  console.log(filteredHouses);
});

db.households.aggregate(
  { $project: { householdId: 1, transactions: 1}},
  { $unwind: "$transactions"},
  { $group : { _id : '$householdId', salesPerHouse : { $sum : "$transactions.netSales" } } },
  function(err, docs) {
    if (err) console.log(err);
    // else console.log(docs);

    // process.exit();
  });

