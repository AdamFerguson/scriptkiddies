// establish mongoose db connection
require('./index');
var mongoose = require('mongoose');

var householdSchema = mongoose.Schema({
  householdId: { type: Number, index: true, unique: true },
  loc: { type: [Number], index: '2dsphere'},
  segmentIds: { type: [Number], index: true },
  transactions: { type: [mongoose.Schema.Types.Mixed] }
});

var Household = module.exports = mongoose.model('Household', householdSchema);
