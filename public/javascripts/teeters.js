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
  	var minimal = app.minimalTheme;
  	var googleclone = app.googlecloneTheme;

    var teetercon = L.icon({
        iconUrl: '/images/ht.png',
        iconSize:     [32,32], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
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
         //teeter.on('click', onMarkerClick);
        teeterList.push(teeter);
      });

	  var teeters = app.teeterLayerGroup = L.layerGroup(teeterList);

	  var overlays = {"Harris Teeters": teeters};
	  L.control.layers(base,overlays).addTo(map);
    });

    /*var markers = new L.MarkerClusterGroup();
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
    }*/

  });
});