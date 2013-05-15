
exports.searchByBounds = function(neLat,neLng,swLat,swLng) {
  var geojsonPoly = { type: 'Polygon', coordinates: [[
    [swLng, swLat],
    [neLng, swLat],
    [neLng, neLat],
    [swLng, neLat],
    [swLng, swLat]
  ]]};
  // returns a query object that you can treat like a promise, or stream
  return this.find({loc: { $within: { $geometry: geojsonPoly }}});
};
