
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
          zoom: 10,
          layers: [minimal,googleclone]
    });

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
  //   // promise.done(function(data,status,jqXHR) {
  //   //   console.log(data,status,jqXHR);
  //   // });
  //   // promise.fail(function(data,status,jqXHR) {
  //   //   console.log(data,status,jqXHR);
  //   // });
  // });

  var base =  {
      "Minimal": minimal,
      "Google Clone": googleclone
  };

//   var teeterList = [];
//   var stores= [];
// Streamable.get('/stores',  {
//       onData:  function(data) {
//         console.log(data);
//       var desc = "Harris Teeter #" + val.storeId;
//       var teeter = L.marker([val.loc[1],val.loc[0]],{icon: teetercon},{title: val.storeId}).bindLabel(desc);
//       teeter.on('click', onMarkerClick);
//       teeterList.push(teeter);
//     },
//       onError: function(e) { console.log(e); },
//       onEnd:   function() { console.log('all done');
//       var teeters = L.layerGroup(teeterList);
//       var overlays = {"Harris Teeters": teeters};
//       L.control.layers(base,overlays).addTo(map);}
//     });

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
    var teeters = L.layerGroup(teeterList);

    var overlays = {"Harris Teeters": teeters};
    L.control.layers(base,overlays).addTo(map);
  });

  var results = [];
  Streamable.get('/tracts',  {
      onData:  function(data) { 
        parsed = JSON.parse(data);
        //console.log(parsed.loc.coordinates[0].length);
        results.push(parsed.loc.coordinates[0].length);
      },
      onError: function(e) { console.log(e); },
      onEnd:   function() { 
        console.log('all done'); 
        console.log(_.max(results));
      }
    });

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


  // var tracts = [];
  //  $.getJSON('/tracts', function(data) {
  //   console.log(data)
  //   // $.each(data, function(key, val) {
  //   // //  console.log(val.loc.coordinates);
  //   //   var polygon = L.polygon([val.loc.coordinates[0]]).bindLabel(val.tractId);
  //   //  // teeter.on('click', onMarkerClick);
  //   //  tracts.push(polygon);
  //   // });
  //   // var tractlayer = L.layerGroup(tracts);
  //   // var overlays = {"Census Tracts": tractlayer};
  //   // L.control.layers(base,overlays).addTo(map);
  // });

  // Themes:
  // - Dark Blue: 67367
  // - Transparent: 998

  });

  return app;
});
