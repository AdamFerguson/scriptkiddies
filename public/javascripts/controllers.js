
function MapCtrl($scope, $http) {
  var cloudmadeUrl = 'http://a.tile.cloudmade.com/b90910898d15474ca52846a11bd303e8/{styleId}/256/{z}/{x}/{y}.png',
      cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

  // var minimal   = L.tileLayer(cloudmadeUrl, {styleId: 22677, attribution: cloudmadeAttribution}),
  //     googleclone  = L.tileLayer(cloudmadeUrl, {styleId: 92017,   attribution: cloudmadeAttribution});

  angular.extend($scope, {
    center: {
      lat: 35.227087,
      lng: -80.843127,
      zoom: 10
    },
    markers: {},
    tilelayer: {
      url: cloudmadeUrl,
      options: {
        styleId: 92017,
        attribution: cloudmadeAttribution
      }
    },
    controls: []
  });

  var teetercon = L.icon({
      iconUrl: '/images/ht.png',
      iconSize:     [32,32], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  // var base =  {
  //     "Minimal": minimal,
  //     "Google Clone": googleclone
  // };

  $scope.teeterList = [];
  promise = $http.get('/stores');
  promise.success(function(response) {
    angular.forEach(response.data, function(key, val) {
      var desc = "Harris Teeter #" + val.storeId;
      var teeter = L.marker([val.loc[1],val.loc[0]],{icon: teetercon},{title: val.storeId}).bindLabel(desc);
      // teeter.on('click', onMarkerClick);
      teeterList.push(teeter);
    });
    // var teeters = L.layerGroup(teeterList);

    // var overlays = {"Harris Teeters": teeters};
    // L.control.layers(base,overlays).addTo(map);
  });

  /*, function(data) {
    angular.each(data, function(key, val) {
      var desc = "Harris Teeter #" + val.storeId;
      var teeter = L.marker([val.loc[1],val.loc[0]],{icon: teetercon},{title: val.storeId}).bindLabel(desc);
      // teeter.on('click', onMarkerClick);
      teeterList.push(teeter);
    });
    var teeters = L.layerGroup(teeterList);

    var overlays = {"Harris Teeters": teeters};
    L.control.layers(base,overlays).addTo(map);
  });*/
}
