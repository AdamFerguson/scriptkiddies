define([
       'app',
       'jquery',
       'leaflet',
       'underscore',
       'leaflet-markercluster',
       'leaflet-label',
       'locationfilter',
       'socketio',
       'streamable',
       'sugar',
       'jquery.dataTables'
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

    var tractMouseHoverHandler = function(tractId) {
      var oldBackgroundColor, myTractLayer;
      var isWhite = false;

      $('#tract-details').delegate('#tract-' + tractId, 'mouseover', function(e) {
        oldBackgroundColor = $(this).css('background-color');
        if (oldBackgroundColor === "rgba(0, 0, 0, 0)") {
          isWhite = true;
        }

        $(this).css('background-color', '#CCC');
        app.tractLayerGroup.eachLayer(function(layer) {
          if (tractId === layer.feature.properties.tractId) {
            myTractLayer = layer;
            layer.setStyle({fillOpacity: 1});
          }
        })
      });

      $('#tract-details').delegate('#tract-' + tractId, 'mouseout', function(e) {
        if (isWhite) $(this).css('background-color', '#FFF');
        else {
          $(this).css('background-color', '#F9F9F9');
        }
        myTractLayer.setStyle({fillOpacity: 0.7});
      });

    };


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

      var tracts = app.selectedTractIds.map(function(tractId) { 
        tractMouseHoverHandler(tractId);
        return app.cachedTractData[tractId]; 
      });

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
                total[description] = total[description] ? (total[description] + trans.netSales) : trans.netSales;
              });
            });
          }
          _.keys(total).forEach(function(desc) {
            if (total[desc]) total[desc] = '$' + total[desc].round(2);
          });
          return total;
        }
      };
      $('#tract-details').html(tractDetailsTmpl(data));
      $('#tracts-details-table').dataTable();
    };
     
  });
});