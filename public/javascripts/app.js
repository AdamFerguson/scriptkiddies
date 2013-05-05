// d3.json('/geojson/edges.json', function(err,data) {
//   console.log(err, data);
// });

$(function() {
  var map = new L.Map("map", {
        center: [35.227087, -80.843127],
        zoom: 10
      }).addLayer(new L.TileLayer("http://c.tile.cloudmade.com/b90910898d15474ca52846a11bd303e8/67367/256/{z}/{x}/{y}.png"));
      // }).addLayer(new L.TileLayer("http://c.tile.cloudmade.com/b90910898d15474ca52846a11bd303e8/67367/256/10/282/405.png"));
});
