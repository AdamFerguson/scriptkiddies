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

    app.searchHouseholdByTractId = function(tractId) {
      var options = {params: {tractIds: tractId}};
      Streamable.get('/households/search/tracts', options, {
        onData: function(data) {
          var householdData = JSON.parse(data);
          householdData['tractId'] = tractId;
          var householdId = householdData.householdId

          var existingHouseholdData = app.cachedHouseholdData[householdId];
          if (existingHouseholdData) {
            if (existingHouseholdData.tractId !== tractId) {
              console.log('Houston, we have a conflict', existingHouseholdData.tractId, tractId);
            }
          } else {
            app.cachedHouseholdData[householdId] = householdData;
            if (!app.cachedTractData[tractId]['households']) {
              app.cachedTractData[tractId]['households'] = {};
            }
            app.cachedTractData[tractId]['households'][householdId] = householdData;
          }
        },
        onError: function(err) { console.log(err); }
      });
    };

    app.plotHouseholds = function() {
      var markerList = [];
      //app.householdLayerGroup.clearLayers();
      var marker = new L.Marker(new L.LatLng(val.loc[1], val.loc[0]), { title: "asdf" });
      markerList.push(marker);
      app.householdLayerGroup.addLayers(markerList);
    };

  });
});