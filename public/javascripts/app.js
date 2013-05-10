// d3.json('/geojson/edges.json', function(err,data) {
//   console.log(err, data);
// });


$(function() {

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
  var teeters = L.layerGroup(teeterList);

  var overlays = {"Harris Teeters": teeters};
  L.control.layers(base,overlays).addTo(map);
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
          //Why does this work here
          markers.clearLayers();
          markers.addLayers(markerList);
          map.addLayer(markers);
       });
    }
  });
}


    //And not work here? I don't understand javascript scoping
    //markers.addLayers(markerList);
    //map.addLayer(markers);
      // Themes:
      // - Dark Blue: 67367
      // - Transparent: 998
});
