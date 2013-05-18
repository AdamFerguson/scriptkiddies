var async      = require('async');
var csv        = require('csv');
var util       = require('util');
var geoUtil    = require('geojson-utils');

var Tract = require('../models').Tract;
var Household = require('../models').Household;

exports.importTracts = function() {
  var metadata = require('../data/census/sf1_labels.json');

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
          var area = Math.abs(geoUtil.area(data));
          Household.find({loc: {$within: {$geometry: data}}}, function(err, households) {
            soFar++;
            if (households && households.length > 0) {
              newTract = new Tract({
                tractId: tract.properties.GEOID10,
                loc: {
                  type:         tract.geometry.type,
                  coordinates:  tract.geometry.coordinates
                },
                area: area
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
          }
        });
      });
  };

  var gendersByAgeImport = function(done) {
    var total = 0, soFar = 0, genderMetadata = metadata['P12']['labels'];
    var rangePattern = /^(\d+)\s?(to|and)?\s?(\d+)?/;
    var lowerKeyFemale     = 'P012027';
    var lowerKeyMale       = 'P012003';
    var upperKeyFemale     = 'P012049';
    var upperKeyMale       = 'P012025';
    var femaleKey          = 'P012026';
    var maleKey            = 'P012002';

    csv().
      from.path(__dirname+'/../data/census/all_140_in_37.P12.csv', {columns: true}).
      on('record', function(row, index) {
        total++;
        var keys = [];
        var data = {gendersByAge: []};
        for (var i = 2; i <= 49; i++) {
          if (i < 10) keys.push('P01200' + i);
          else keys.push('P0120' + i);
        }

        for (var x = 0; x < keys.length; x++) {
          var minAge, maxAge, gender, year, key = keys[x];

          // break if one of the gender keys
          if (genderMetadata[key]['parent'] === 'P012001') continue;

          if (key === lowerKeyFemale || key === lowerKeyMale) { minAge = 0; maxAge = 4; }
          else if (key === upperKeyFemale || key === upperKeyMale) { minAge = 85; }
          else {
            var matches = genderMetadata[key]['text'].match(rangePattern);
            minAge = matches[1];
            maxAge = matches[3];
            if (genderMetadata[key]['parent'] === maleKey) {
              gender = 'male';
            } else {
              gender = 'female';
            }

            data.gendersByAge.push({
              year: 2000,
              gender: gender,
              ageRange: {
                minAge: minAge, 
                maxAge: maxAge
              },
              count: row[key + '.2000']
            });
            data.gendersByAge.push({
              year: 2010,
              gender: gender,
              ageRange: {minAge: minAge, maxAge: maxAge},
              count: row[key]
            });
          }
        }

        Tract.update({tractId: row.GEOID}, data, function(err,tract) {
          soFar++;
          if (err) console.log(err);
          else {
            console.log('Gender by Age import: ' + soFar);
          }

          if (soFar === total) {
            console.log('done importing Gender by Age');
            done();
            process.exit();
          }
        });
      });
  };

  async.series([tractsJsonImport, familiesImport, averageHouseholdSizesByAgeImport, gendersByAgeImport]);

};
