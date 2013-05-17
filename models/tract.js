// establish mongoose db connection
require('./index');
var mongoose = require('mongoose');

var tractSchema = mongoose.Schema({
  tractId: { type: Number, index: true, unique: true },
  loc: { type: { type: String }, coordinates: mongoose.Schema.Types.Mixed },
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
    ageRange: {
      minAge: { type: Number, index: true },
      maxAge: { type: Number, index: true }
    },
    count: { type: Number }
  }]
});

tractSchema.index({loc: '2dsphere'});


var Tract = module.exports = mongoose.model('Tract', tractSchema);
