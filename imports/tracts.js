var async      = require('async');
var csv        = require('csv');
var util       = require('util');

var Tract = require('../models').Tract;

exports.importTracts = function() {
  var metadata;

  var tractsJsonImport = function(done) {
    Tract.remove({}, function(err) {
      if (err) console.log(err);
      else {
        var tracts = require('../data/census/tract.json');
        var total = tracts.features.length;
        var soFar = 0;
        tracts.features.forEach(function(tract) {
          newTract = new Tract({
            tractId: tract.properties.GEOID10,
            loc: {
              type:         tract.geometry.type,
              coordinates:  tract.geometry.coordinates
            }
          });
          newTract.save(function(err) {
            soFar++;
            if (soFar === total) {
              console.log('Done importing geocoordinates');
              done();
            } else {
              console.log('Imported ' + soFar);
            }
          });
        });
      }
    });
  }

  var metadataImport = function(done) {
    metadata = require('../data/census/sf1_labels.json');
    console.log('done importing metadata');
    done();
  }

  var populationImport = function(done) {
    var total, soFar;

    csv().
      from.path(__dirname+'/../data/census/all_140_in_37.P35.csv', {columns: true}).
      on('record', function(row, index) {
        total++;
        Tract.findOne({tractId: row.GEOID}, function(err,tract) {
          if (err) console.log(err);
          else {
          }
        });
      });
  }

  var averageHouseholdSizesByAgeImport = function(done) {
  }

  var gendersByAgeImport = function(done) {
  }

  async.series([/*tractsJsonImport,*/ metadataImport])

};
