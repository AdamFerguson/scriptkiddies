// establish mongoose db connection
require('./index');
var mongoose = require('mongoose');

var householdSchema = mongoose.Schema({
  householdId: { type: Number, index: true, unique: true },
  loc: { type: [Number], index: '2dsphere'},
  segmentIds: { type: [Number], index: true },
  transactions: [{
    date:        {type: Date, index: true},
    netSales:    {type: Number},
    description: {type: String, index: true},
    storeId:     {type: Number, index: true}
  }]
});

var Household = module.exports = mongoose.model('Household', householdSchema);
