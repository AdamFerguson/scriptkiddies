// establish mongoose db connection
require('./index');
var mongoose = require('mongoose');

var tractSchema = mongoose.Schema({
  tractId: { type: Number, index: true, unique: true },
  loc: { type: mongoose.Schema.Types.Mixed },
  totalPopulations: [{
    year: { type: Number, index: true },
    count: { type: Number }
  }],
  numHouseholds: [{
    year: { type: Number, index: true },
    count: { type: Number }
  }],
  numFamilies: [{
    year: { type: Number, index: true },
    count: { type: Number }
  }],
  averageHouseholdSizesByAge: [{
    year: { type: Number, index: true },
    ageRange: {
      minAge: { type: Number, index: true },
      maxAge: { type: Number, index: true }
    },
    count: { type: Number }
  }],
  gendersByAge: [{
    year: { type: Number, index: true },
    gender: { type: String, index: true},
    ageRange: {
      minAge: { type: Number, index: true },
      maxAge: { type: Number, index: true }
    },
    count: { type: Number }
  }]
});

tractSchema.index({loc: '2dsphere'});
var searchByBounds = require('../lib/search_utils').searchByBounds;

tractSchema.static('searchByBounds', searchByBounds);

var Tract = module.exports = mongoose.model('Tract', tractSchema);
