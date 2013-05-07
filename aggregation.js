var mongojs = require('mongojs');

var db = mongojs('scriptkiddies', ['households', 'stores']);

db.households.aggregate(
  { $project: { householdId: 1, transactions: 1}},
  { $unwind: "$transactions"},
  { $group : { _id : '$householdId', salesPerHouse : { $sum : "$transactions.netSales" } } },
  function(err, docs) {
    if (err) console.log('err');
    else console.log(docs);

    process.exit();
  });
