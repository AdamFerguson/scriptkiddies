// establish mongoose db connection
require('./index');
var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({
  storeId: { type: Number, index: true, unique: true },
  loc: { type: [Number], index: '2dsphere'},
});

var Store = module.exports = mongoose.model('Store', storeSchema);
