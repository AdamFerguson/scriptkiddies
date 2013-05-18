
define([
       'jquery',
       'angular',
       'foundation',
       'leaflet',
       'd3',
       'underscore',
       'leaflet-markercluster',
       'leaflet-label',
       'locationfilter',
       'socketio',
       'streamable',
       'angular-leaflet-directive'
      ], function($,angular) {

  var app = angular.module('scriptkiddies', []);

  $(function() {

  angular.bootstrap(document, ['scriptkiddies']);

  var teetercon = L.icon({
      iconUrl: '/images/ht.png',
      iconSize:     [32,32], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  var cloudmadeUrl = 'http://a.tile.cloudmade.com/b90910898d15474ca52846a11bd303e8/{styleId}/256/{z}/{x}/{y}.png',
      cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

  var minimal   = L.tileLayer(cloudmadeUrl, {styleId: 22677, attribution: cloudmadeAttribution}),
      googleclone  = L.tileLayer(cloudmadeUrl, {styleId: 92017,   attribution: cloudmadeAttribution});

  var map = new L.Map("map", {
          center: [35.227087, -80.843127],
          zoom: 11,
          layers: [minimal,googleclone]
    });

  var locationFilter = new L.LocationFilter().addTo(map);

  locationFilter.on('change', function(e) {
    var ne = e.bounds.getNorthEast();
    var sw = e.bounds.getSouthWest();
    var reqData = {params: {neLat: ne.lat, neLng: ne.lng, swLat: sw.lat, swLng: sw.lng}};
    Streamable.get('/households/search/bounds', reqData, {
      onData:  function(data) { console.log(data); },
      onError: function(e) { console.log(e); },
      onEnd:   function() { console.log('all done'); }
    });
  });

  var base =  {
      "Minimal": minimal,
      "Google Clone": googleclone
  };


  var teeterList = [];
  var stores= [];
  $.getJSON('/stores', function(data) {
    stores = data;
    $.each(data, function(key, val) {
      var desc = "Harris Teeter #" + val.storeId;
      var teeter = L.marker([val.loc[1],val.loc[0]],{icon: teetercon},{title: val.storeId}).bindLabel(desc);
       teeter.on('click', onMarkerClick);
      teeterList.push(teeter);
    });

  });

  var teeters = L.layerGroup(teeterList);
  var results = [];
  var tracts;
  var myLayer = L.geoJson(null,{
        style: function(feature) {
          var totalPop   = feature.properties['Population 2010'];
          var popDensity = feature.properties['Pop Density 2010'];
          var blueHex;
          try {
            // precalculated
            // max pop: 13750
            // min pop: 368
            // max pop density: 51366172.487773284 
            // min pop density: 892.1236703140514
            var blueDecimal = ((popDensity / 51400000) * 255);
            blueHex = parseInt(blueDecimal, 10).toString(16).substr(0,2);
            if (blueHex.length === 1) blueHex = '0' + blueHex;
          }
          catch(exception) {
            blueHex = '33';
          }
          return {
            weight: 1,
            color: '#333333',
            fillColor: '#' + blueHex + blueHex + blueHex,
            fillOpacity: 0.4
          }
        }
      }).addTo(map);

  var totalTractIds = 0;
  Streamable.get('/tracts',  {
    onData:  function(data) {
      parsed = JSON.parse(data);
      try {
        var area = parsed.area;
        var totalPop2000 = _.where(parsed.totalPopulations, {year: 2000})[0].count;
        var totalPop2010 = _.where(parsed.totalPopulations, {year: 2010})[0].count;
        var populationDensity2000 = totalPop2000 / area;
        var populationDensity2010 = totalPop2010 / area;
      } 
      catch(exception) {
        console.log(exception);
      }

      if (totalTractIds < 5) {
        totalTractIds++;
        results.push(parsed.tractId);
      }
      var tract = [{
        "type": "Feature",
        "properties": {
          'Population 2010': totalPop2010,
          'Population 2000': totalPop2000,
          'Area'           : area,
          'Pop Density 2000': populationDensity2000,
          'Pop Density 2010': populationDensity2010
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": parsed.loc.coordinates
        }
      }];
      myLayer.addData(tract);
    },
    onError: function(e) { console.log(e); },
    onEnd: function() {
      console.log('all done');
      var options = {params: {tractIds: results.join(',')}};
      Streamable.get('/households/search/tracts', options, {
        onData: function(data) {
          console.log(JSON.parse(data));
        },
        onError: function(err) {
          console.log(err);
        }
      })
      //console.log(_.max(results));
      //console.log(_.sortBy(results, function(num) { return num; }));
    }
  });


  var overlays = {"Harris Teeters": teeters};
  L.control.layers(base,overlays).addTo(map);

  var markers = new L.MarkerClusterGroup();
  function onMarkerClick(e) {
     $.each(stores, function(key, val) {
        console.log(e);
        if( val.loc[1] == e.target._latlng.lat && val.loc[0] == e.target._latlng.lng){
        var markerList = [];
        var storeurl = '/stores/' + val.storeId + '/households';
        $.getJSON(storeurl, function(data) {
           $.each(data, function(key, val) {
             var marker = new L.Marker(new L.LatLng(val.loc[1], val.loc[0]), { title: "asdf" });
             markerList.push(marker);
           });
            markers.clearLayers();
            markers.addLayers(markerList);
            map.addLayer(markers);
         });
      }
    });
  }


  // Themes:
  // - Dark Blue: 67367
  // - Transparent: 998

  });

  return app;
});
