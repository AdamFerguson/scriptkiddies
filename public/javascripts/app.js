
define([
       'jquery',
       'leaflet',
       'underscore',
       'leaflet-markercluster',
       'leaflet-label',
       'locationfilter',
       'socketio',
       'streamable',
      ], 

function() {

  // Poor man's namespacing
  // Judges, please be gentle, I know the front end code is less than great
  // Would have gone for Angular if we had a little more time
  var app =  {
    map: null,
    tractLayerGroup: null,
    householdLayerGroup: null,
    teeterLayerGroup: null,
    getColor: null,
    minimalTheme: null,
    googlecloneTheme: null,
    selectedTractIds: [],
    cachedTractData: {},
    cachedHouseholdData: {},
    layerSelectedStyle: {weight: 2, color: '#666', dashArray: '', fillOpacity: 0.7 },

    updateTracts:             function() {},
    updateHouseholds:         function() {},
    searchHouseholdByTractId: function() {},
    plotHouseholds:           function() {},
    updateHouseholdCount:     function() {},
    updateTractDetails:       function() {}
  };

  var getColor = app.getColor = function(d) {
        return d > 5000 ? '#800026' :
               d > 4000  ? '#BD0026' :
               d > 3000  ? '#E31A1C' :
               d > 2500  ? '#FC4E2A' :
               d > 1500   ? '#FD8D3C' :
               d > 1000   ? '#FEB24C' :
               d > 500   ? '#FED976' :
                          '#FFEDA0';
    };
  // initialize the map
  $(function() {


    var cloudmadeUrl = 'http://a.tile.cloudmade.com/b90910898d15474ca52846a11bd303e8/{styleId}/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

    var minimal     = app.minimalTheme     = L.tileLayer(cloudmadeUrl, {styleId: 22677, attribution: cloudmadeAttribution}),
        googleclone = app.googlecloneTheme = L.tileLayer(cloudmadeUrl, {styleId: 92017,   attribution: cloudmadeAttribution});

    var map = app.map = new L.Map("map", {
            center: [35.227087, -80.843127],
            zoom: 10,
            layers: [minimal,googleclone]
      });

    var markers = app.householdLayerGroup = new L.MarkerClusterGroup({
      zoomToBoundsOnClick: false,
      maxClusterRadius: 50,
      disableClusteringAtZoom: 15,
      showCoverageOnHover: false,
      spiderfyDistanceMultiplier: 2
    });
    map.addLayer(markers);

    var colorTemplate = _.template($('#color-legend-tpl').html());
    var colorTemplateData = {grades: []};
    var grades = [0, 500, 1000, 1500,2500, 3000, 4000, 5000];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      var data = {color: getColor(grades[i] + 1), low: grades[i] };
      if (grades[i + 1]) data.high = grades[i + 1];
      colorTemplateData.grades.push(data);
    }
    $('#color-legend').html(colorTemplate(colorTemplateData));


    // Poor man's data bindings
    var handleDataPlots = function() {
      app.plotHouseholds();
      app.updateTractDetails();
      setTimeout(handleDataPlots, 1000);
    };
    handleDataPlots();

    var handleHouseholdCount = function() {
      app.updateHouseholdCount();
      setTimeout(handleHouseholdCount, 50);
    };
    handleHouseholdCount();

    // var locationFilter = new L.LocationFilter().addTo(map);

    // locationFilter.on('change', function(e) {
    //   var ne = e.bounds.getNorthEast();
    //   var sw = e.bounds.getSouthWest();
    //   var reqData = {params: {neLat: ne.lat, neLng: ne.lng, swLat: sw.lat, swLng: sw.lng}};
    //   Streamable.get('/households/search/bounds', reqData, {
    //     onData:  function(data) { console.log(data); },
    //     onError: function(e) { console.log(e); },
    //     onEnd:   function() { console.log('all done'); }
    //   });
    // });

  });

  return app;
});
