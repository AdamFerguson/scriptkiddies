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

    app.updateHouseholds = function() {
      /*var options = {params: {tractIds: results.join(',')}};
      Streamable.get('/households/search/tracts', options, {
        onData: function(data) {
          console.log(JSON.parse(data));
        },
        onError: function(err) {
          console.log(err);
        }
      });*/
    }

  });
});