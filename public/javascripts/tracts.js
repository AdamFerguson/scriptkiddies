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
            app.cachedTractData[tractId] = JSON.parse(data);
            app.cachedTractData[tractId]['households'] = {};
          },
          onError: function(e) { console.log(e); },
          onEnd: function() {}
        });
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
              app.cachedTractData[tractId]['households'][householdId] = householdData;
            }
          },
          onError: function(err) { console.log(err); }
        });
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
                              info.update(layer.feature.properties);
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
                            layer.setStyle({fillOpacity: 0.8});
                            selectedTractIds.push(tractId);
                          }
                          app.updateTracts();
	  	                  }
            });
          }
        }).addTo(map);

    $('#clear-search').on('click', function(e) {
      myLayer.eachLayer(function(layer) {
        layer.setStyle({fillOpacity: 0.4});
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

	var info = L.control();
	info.onAdd = function (map) {
	  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	  this.update();
	  return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function (props) {
	  this._div.innerHTML = '<h4>NC Census Tract Data</h4>' +  (props ?
	      '<b>' +'Population Density 2010' + '</b>' + props.density + ' people / mi<sup>2</sup></br>' +
	      '<b>' +'Population Density 2010' + '</b>' + props.density + ' people / mi<sup>2</sup>'
	      : 'Hover over an area');
	};
	info.addTo(map);


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