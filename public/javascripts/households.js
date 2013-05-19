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

    var oldSelectedTractIds = [];
    app.plotHouseholds = function() {
      if (_.difference(app.selectedTractIds, oldSelectedTractIds).length === 0
          && _.difference(oldSelectedTractIds, app.selectedTractIds).length === 0) {
        return;
      }

      oldSelectedTractIds = _.clone(app.selectedTractIds);
      var markerList = [];
      app.householdLayerGroup.clearLayers();
      app.selectedTractIds.forEach(function(tractId) {
        if (app.cachedTractData[tractId] && app.cachedTractData[tractId]['households']) {
          _.keys(app.cachedTractData[tractId]['households']).forEach(function(householdId) {
            var household = app.cachedHouseholdData[householdId];
            var lat = household.loc.coordinates[1], lng = household.loc.coordinates[0];
            var marker = new L.Marker(new L.LatLng(lat, lng), { title: "asdf" });
            markerList.push(marker);
          });
        }
      });
      app.householdLayerGroup.addLayers(markerList);
    };

  });
});