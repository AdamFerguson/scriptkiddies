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

    app.updateTracts = function() {
      // interested in the tractId's that don't have any household data
      cachedTractIds = _.filter(_.keys(app.cachedTractData), function(tractId){
        return app.cachedTractData[tractId]['households'];
      }).map(function(tractId) { return parseInt(tractId)});

      neededTractIds = _.difference(selectedTractIds, cachedTractIds);
      neededTractIds.forEach(function(tractId) {
        Streamable.get('/tracts/' + tractId,  {
          onData:  function(data) {
            try {
              var householdData = app.cachedTractData[tractId]['households'];
            }
            catch (exception) {
            }
            $.extend(app.cachedTractData[tractId], JSON.parse(data));
            if (householdData) {
              app.cachedTractData[tractId]['households'] = householdData;
            } else {
              app.cachedTractData[tractId]['households'] = {};
            }
          },
          onError: function(e) { console.log(e); },
          onEnd: function() {}
        });
        app.searchHouseholdByTractId(tractId);
      });
    }

    var myLayer = app.tractLayerGroup  = L.geoJson(null,{
          style: function(feature) {
            return {
                fillColor: getColor(feature.properties.pop),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.4
            };
          },
          onEachFeature: function(feature, layer) {
            var tractId = feature.properties.tractId;
            var wasPreSelected = false;

            layer.on({
                mouseover: function (e) {

                              if (!_.contains(selectedTractIds, tractId)) {

                                selectedTractIds.push(tractId);
                                app.updateTracts();

                                info.update(layer.feature.properties.tractId);
                                layer.setStyle(app.layerSelectedStyle);
                                if (!L.Browser.ie && !L.Browser.opera) {
                                    layer.bringToFront();
                                }
                              }

                          },
                mouseout: function (e) {
                            if (!wasPreSelected) {
                              var index = selectedTractIds.indexOf(tractId);
                              selectedTractIds.splice(index,1);
                              myLayer.resetStyle(e.target);
                              info.update();
                            }
                          },
                click: function (e) {
  			                  //map.fitBounds(e.target.getBounds());
    				              // e contains properties:
    				              // latlng, corresponds to L.LatLng coordinate clicked on map

                          if (wasPreSelected) {

                            wasPreSelected = false;
                            myLayer.resetStyle(layer);
                            var index = selectedTractIds.indexOf(tractId);
                            selectedTractIds.splice(index,1);
                          } else {
                            wasPreSelected = true;
                            layer.setStyle(app.layerSelectedStyle);
                            selectedTractIds.push(tractId);
                          }
                          app.updateTracts();
	  	                  }
            });
          }
        }).addTo(map);

    $('#clear-search').on('click', function(e) {
      app.selectedTractIds = [];
      myLayer.eachLayer(function(layer) {
        myLayer.resetStyle(layer);
      });
    });

    Streamable.get('/tracts',  {
      onData:  function(data) {
        parsed = JSON.parse(data);
        try {
          var area = parsed.area = calcArea([parsed.loc.coordinates]);
          var totalPop2000 = parsed.totalPop2000 = _.where(parsed.totalPopulations, {year: 2000})[0].count;
          var totalPop2010 = parsed.totalPop2010 = _.where(parsed.totalPopulations, {year: 2010})[0].count;
          var populationDensity2000 = parsed.populationDensity2000 = totalPop2000 / area;
          var populationDensity2010 = parsed.populationDensity2010 = totalPop2010 / area;
        }
        catch(exception) {
          console.log(exception);
        }

        app.cachedTractData[parsed.tractId] = parsed;

        var tract = [{
          "type": "Feature",
          "properties": {
            tractId: parsed.tractId,
            'Population 2010': totalPop2010,
            'pop': totalPop2000,
            'Area'           : area,
            'Pop Density 2000': populationDensity2000,
            'density': populationDensity2010
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": parsed.loc.coordinates
          }
        }];
        myLayer.addData(tract);
      },
      onError: function(e) { console.log(e); },
      onEnd: function() {console.log('all done'); }
    });

	var info = {};

  var template = _.template($('#hovered-info-tpl').html());

  // method that we will use to update the control based on feature properties passed
	info.update = function (tractId) {
    var data = {tract: false};
    if (tractId) {
      var tract = window.tract = app.cachedTractData[tractId];
      data = {tract: tract};
    }
    $('#hovered-info').html(template(data));
	};


	var calcArea = function(coordinates){
	    return  _.map(coordinates, function(entry) {
	      return _.reduce(entry, function(list, polygon) {
	          _.each(_.map(polygon, function(point) {
	              return new google.maps.LatLng(point[1], point[0]);
	          }), function(point) {
	              list.push(point);
	      });
	          var area = google.maps.geometry.spherical.computeArea(list) / 2589988;
	          return area;
	      }, []);
		  })
	  };
  });
});