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
      cachedTractIds = _.keys(app.cachedTractData).map(function(tractId) { return parseInt(tractId)});
      neededTractIds = _.difference(selectedTractIds, cachedTractIds);
      neededTractIds.forEach(function(tractId) {
        Streamable.get('/tracts/' + tractId,  {
          onData:  function(data) {
            try {
              var householdData = app.cachedTractData[tractId]['households'];
            }
            catch (exception) {
            }
            app.cachedTractData[tractId] = JSON.parse(data);
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

            layer.on({
                mouseover: function highlightFeature(e) {
                              info.update(layer.feature);
                              layer.setStyle({
                                  weight: 2,
                                  color: '#666',
                                  dashArray: '',
                                  fillOpacity: 0.7
                              });

                              if (!L.Browser.ie && !L.Browser.opera) {
                                  layer.bringToFront();
                              }
                          },
                mouseout: function resetHighlight(e) {
                            if (!(_.contains(selectedTractIds, tractId))) {
                              myLayer.resetStyle(e.target);
                            }
                            info.update();
                          },
                click: function zoomToFeature(e) {
  			                  //map.fitBounds(e.target.getBounds());
    				              // e contains properties:
    				              // latlng, corresponds to L.LatLng coordinate clicked on map
    				              // containerPoint, L.Point
    				              // layerPoint, L.Point

                          if (_.contains(selectedTractIds, tractId)) {

                            myLayer.resetStyle(layer);
                            var index = selectedTractIds.indexOf(tractId);
                            selectedTractIds.splice(index,1);
                          } else {
                            layer.setStyle({
                                weight: 2,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7
                            });
                            selectedTractIds.push(tractId);
                          }
                          app.updateTracts();
	  	                  }
            });
          }
        }).addTo(map);

    $('#clear-search').on('click', function(e) {
      selectedTractIds = [];
      myLayer.eachLayer(function(layer) {
        myLayer.resetStyle(layer);
      });
    });

    Streamable.get('/tracts',  {
      onData:  function(data) {
        parsed = JSON.parse(data);
        try {
          var area = calcArea([parsed.loc.coordinates]);
          var totalPop2000 = _.where(parsed.totalPopulations, {year: 2000})[0].count;
          var totalPop2010 = _.where(parsed.totalPopulations, {year: 2010})[0].count;
          var populationDensity2000 = totalPop2000 / area;
          var populationDensity2010 = totalPop2010 / area;
        }
        catch(exception) {
          console.log(exception);
        }

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

  var templateString = '<h4>NC Census Tract Data</h4>' +
      '<% if (tract) { %>' +
        '<table>' + 
        '<tr><th>Population Density 2010</th><td><%= tract.density %> people / mi<sup>2</sup></td></tr>' +
        '</table>' + 
      '<% } else { %>' + 
         '<p>Hover over an area</p>' +
       '<% } %>';
  var template = _.template(templateString);

  // method that we will use to update the control based on feature properties passed
	info.update = function (feature) {
    var data = {};
    if (feature) {
      data = {tract: {
        density: feature.properties.density.toFixed(2)
      }};
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