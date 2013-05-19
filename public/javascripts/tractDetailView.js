define([
       'app',
       'jquery',
       'leaflet',
       'underscore',
       'leaflet-markercluster',
       'leaflet-label',
       'locationfilter',
       'socketio',
       'streamable'
      ], 

function(app) {

  $(function() {
    var map = app.map;
    var getColor = app.getColor;
    var selectedTractIds = app.selectedTractIds;

    $('#view-details').on('click', function(e){
      $('#content-and-controls').slideToggle({
        duration: 800,
        complete: function() {
          $('#tract-details').slideToggle(800);
        }
      });
    });

    $('#tract-details').delegate('#view-summary','click', function(e){
      $('#tract-details').slideToggle({
        duration: 800,
        complete: function() {
          $('#content-and-controls').slideToggle(800);
        }
      });
    });


    var tractDetailsTmpl = _.template($('#tract-details-tmpl').html());
    var oldSelectedTractIds = [];
    var firstRender = true;
    app.updateTractDetails = function() {
      if (_.difference(app.selectedTractIds, oldSelectedTractIds).length === 0
          && _.difference(oldSelectedTractIds, app.selectedTractIds).length === 0 && !firstRender) {
        return;
      }
      oldSelectedTractIds = _.clone(app.selectedTractIds);
      firstRender = false;

      var tracts = app.selectedTractIds.map(function(tractId) { return app.cachedTractData[tractId]; });
      var data = {
        tracts: tracts,
        averageHouseholdSize: function(tract, year) {
          var result = _.find(tract.averageHouseholdSizesByAge, function(size) {
            return (size.year === year && size.ageRange.minAge === 0 && !size.ageRange.maxAge);
          });

          return result ? result.count : 'N/A';
        },
        totalSales: function(tract) {
          var total = {};
          if (tract.households) {
            _.keys(tract.households).forEach(function(householdId) {
              var household = tract.households[householdId];
              household.transactions.forEach(function(trans) {
                var description = trans.description;
                total[description] = total[description] ? (total[description] + total.netSales) : trans.netSales;
              });
            });
          }
          return total;
        }
      };
      $('#tract-details').html(tractDetailsTmpl(data));
    };
     
  });
});