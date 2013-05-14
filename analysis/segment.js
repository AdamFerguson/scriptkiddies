var mongojs = require('mongojs');
var db = mongojs('scriptkiddies', ['households', 'stores']);


db.households.aggregate(
  {$unwind: "$transactions"},
  {$group: {_id: "$transactions.segmentId",
      transactionsPerSegment: { $sum: 1 },
      salesPerSegment: { $sum: "$transactions.netSales" },
      averageSalesPerSegmentPerTransaction: { $avg: "$transactions.netSales" }
    },
  }, function(err, results) {
    console.log(err,results);
    process.exit();
  });
