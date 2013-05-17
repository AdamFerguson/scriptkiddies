// establish mongoose db connection
require('./index');
var mongoose = require('mongoose');

var tractSchema = mongoose.Schema({
  tractId: { type: Number, index: true, unique: true },
  // loc: { type: { type: String }, coordinates: [Number]},
  loc: { type: { type: String, coordinates: mongoose.Schema.Types.Mixed} }
});

tractSchema.index({loc: '2dsphere'});


var Tract = module.exports = mongoose.model('Tract', tractSchema);
