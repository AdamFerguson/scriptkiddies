var async      = require('async');
var csv        = require('csv');
var util       = require('util');

var Tract = require('../models').Tract;

exports.importTracts = function() {
  Tract.remove({}, function(err) {
    if (err) console.log(err);
    else {
      var tracts = require('../data/census/tract.json');
      tracts.features.forEach(function(tract) {
        newTract = new Tract({
          tractId: tract.properties.GEOID10,
          loc: {
            type:         tract.geometry.type,
            coordinates:  tract.geometry.coordinates
          }
        });
        newTract.save(function(err) {
          if (err) return console.log(err);
          return console.log(newTract);
        });
      });
    }
  });
};
