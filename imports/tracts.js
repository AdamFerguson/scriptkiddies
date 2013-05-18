var async      = require('async');
var csv        = require('csv');
var util       = require('util');

var Tract = require('../models').Tract;
var Household = require('../models').Household;

exports.importTracts = function() {
  var metadata;

  var tractsJsonImport = function(done) {
    Tract.remove({}, function(err) {
      if (err) console.log(err);
      else {
        var tracts = require('../data/census/tract.json');
        var total = tracts.features.length;
        var soFar = 0;
        var totalImported = 0;
        tracts.features.forEach(function(tract) {
          var data = {
            type: tract.geometry.type,
            coordinates: tract.geometry.coordinates
          }
          Household.find({loc: {$within: {$geometry: data}}}, function(err, households) {
            soFar++;
            if (households && households.length > 0) {
              newTract = new Tract({
                tractId: tract.properties.GEOID10,
                loc: {
                  type:         tract.geometry.type,
                  coordinates:  tract.geometry.coordinates
                }
              });
              newTract.save(function(err) {
                  totalImported++;
                  console.log('Imported ' + totalImported);
              });
            }
            if (soFar === total) {
              done();
            }
          });
        });
      }
    });
  };

  var metadataImport = function(done) {
    metadata = require('../data/census/sf1_labels.json');
    console.log('done importing metadata');
    done();
  };

  var familiesImport = function(done) {
    var total = 0, soFar = 0;

    csv().
      from.path(__dirname+'/../data/census/all_140_in_37.P35.csv', {columns: true}).
      on('record', function(row, index) {
        total++;
        var data = {
          totalPopulations: [
            {year: 2000, count: row['POP100.2000']},
            {year: 2010, count: row['POP100']}
          ],
          numHouseholds: [
            {year: 2000, count: row['HU100.2000']},
            {year: 2010, count: row['HU100']}
          ],
          numFamilies: [
            {year: 2000, count: row['P035001.2000']},
            {year: 2010, count: row['P035001']}
          ]
        };

        Tract.update({tractId: row.GEOID}, data, function(err,tract) {
          soFar++;
          if (err) console.log(err);
          else {
            console.log('Population import: ' + soFar);
          }

          if (soFar === total) {
            console.log('done importing population');
            done();
          }
        });
      });
  };

  var averageHouseholdSizesByAgeImport = function(done) {
    var total = 0, soFar = 0;

    csv().
      from.path(__dirname+'/../data/census/all_140_in_37.P17.csv', {columns: true}).
      on('record', function(row, index) {
        total++;
        var data = {
          averageHouseholdSizesByAge: [
            { year: 2000,
              ageRange: {
                minAge: 0,
                maxAge: 17
              },
              count: row['P017002.2000']
            },
            { year: 2000,
              ageRange: { minAge: 18 },
              count: row['P017003.2000']
            },
            { year: 2000,
              ageRange: { minAge: 0 },
              count: row['P017001.2000']
            },
            { year: 2010,
              ageRange: {
                minAge: 0,
                maxAge: 17
              },
              count: row['P017002']
            },
            { year: 2010,
              ageRange: { minAge: 18 },
              count: row['P017003']
            },
            { year: 2010,
              ageRange: { minAge: 0 },
              count: row['P017001']
            }
          ]
        };

        Tract.update({tractId: row.GEOID}, data, function(err,tract) {
          soFar++;
          if (err) console.log(err);
          else {
            console.log('Average Household Size import: ' + soFar);
          }

          if (soFar === total) {
            console.log('done importing Average Household Size');
            done();
            process.exit();
          }
        });
      });
  };

  var gendersByAgeImport = function(done) {
  };

  async.series([tractsJsonImport, metadataImport, familiesImport, averageHouseholdSizesByAgeImport]);

};
