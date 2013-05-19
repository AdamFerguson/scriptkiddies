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
    app.updateTractDetails = function() {
      if (_.difference(app.selectedTractIds, oldSelectedTractIds).length === 0
          && _.difference(oldSelectedTractIds, app.selectedTractIds).length === 0) {
        return;
      }
      oldSelectedTractIds = _.clone(app.selectedTractIds);

      var tracts = app.selectedTractIds.map(function(tractId) { return app.cachedTractData[tractId]; });
      $('#tract-details').html(tractDetailsTmpl({tracts: tracts}));
    };
     
  });
});