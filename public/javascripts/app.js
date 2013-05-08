// d3.json('/geojson/edges.json', function(err,data) {
//   console.log(err, data);
// });

var map;
$(function() {
  map = new L.Map("map", {
        center: [35.227087, -80.843127],
        zoom: 10
      }).addLayer(new L.TileLayer("http://c.tile.cloudmade.com/b90910898d15474ca52846a11bd303e8/998/256/{z}/{x}/{y}.png"));

$.getJSON('/stores', function(data) {
  $.each(data, function(key, val) {
    var desc = "Harris Teeter #" + val.storeId;
    var marker = L.marker([val.loc[1],val.loc[0]]).addTo(map).bindPopup(desc);
  });
});

// this prints out the houses but pretty much just crashes
// $.getJSON('/households', function(data) {
//   $.each(data, function(key, val) {
//     var marker = L.marker([val.loc[1],val.loc[0]]).addTo(map).bindPopup('houses');
//   });
// });

      // Themes:
      // - Dark Blue: 67367
      // - Transparent: 998
});
