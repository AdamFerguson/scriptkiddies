var mongojs = require('mongojs');

var db = mongojs('scriptkiddies', ['households', 'stores']);

var underscore = require('underscore');

db.households.aggregate(
  { $unwind: "$transactions" },
  { $group: { _id: "$transactions.segmentId" } },
  function(err,docs) {
    console.log("total segments: " + docs.length);
    // process.exit();
  }
);

db.households.aggregate(
  { $unwind: "$transactions" },
  { $group: { _id: "$householdId", segmentsPerHouse: { $addToSet: "$transactions.segmentId" } }},
  // { $match: { segmentsPerHouse: { $gt: 1}}},
  function(err,docs) {
    results = underscore.filter(docs, function(doc) {
      return doc.segmentsPerHouse.length > 1;
    });
    console.log(results.length);
    // process.exit();
  }
);
