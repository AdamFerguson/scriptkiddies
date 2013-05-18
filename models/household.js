// establish mongoose db connection
require('./index');
var mongoose = require('mongoose');

var householdSchema = mongoose.Schema({
  householdId: { type: Number, index: true, unique: true },
  loc: { type: mongoose.Schema.Types.Mixed},
  //loc: { type: [Number] },
  transactions: [{
    date:        {type: Date, index: true},
    netSales:    {type: Number},
    description: {type: String, index: true},
    storeId:     {type: Number, index: true},
    segmentId:   {type: Number, index: true}
  }]
});

householdSchema.index({loc: '2dsphere'});
var searchByBounds = require('../lib/search_utils').searchByBounds;

householdSchema.static('searchByBounds', searchByBounds);

var Household = module.exports = mongoose.model('Household', householdSchema);
