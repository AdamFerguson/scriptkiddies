require.config({
  shim: {
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    },
    'angular-leaflet-directive': ['angular','leaflet'],
    'd3': { exports: 'd3' },
    'foundation': ['jquery'],
    'jquery.dataTables': ['jquery'],
    'leaflet': { exports: 'L' },
    'leaflet-label':['leaflet'],
    'leaflet-markercluster': ['leaflet'],
    'locationfilter':['leaflet'],
    'socketio': {},
    'streamable': {
      deps: ['jquery', 'socketio'],
      exports: 'Streamable'
    },
    'sugar': {},
    'underscore': { exports: '_' }
  },

  paths: {
    'angular-leaflet-directive': 'vendor/angular-leaflet-directive',
    'leaflet-label':             'vendor/leaflet.label',
    'leaflet-markercluster':     'vendor/leaflet.markercluster',
    angular:                     'vendor/angular.min',
    d3:                          'vendor/d3.v3',
    foundation:                  'vendor/foundation.min',
    jquery:                      'vendor/jquery-1.9.1.min',
    'jquery.dataTables':         'vendor/jquery.dataTables.min',
    leaflet:                     'vendor/leaflet',
    locationfilter:              'vendor/locationfilter',
    socketio:                    'vendor/socket.io',
    streamable:                  'vendor/streamable',
    sugar:                       'vendor/sugar-1.3.9.min',
    underscore:                  'vendor/underscore-min'
  }
});

require(['app','tracts','teeters','households','tractDetailView'], function(app) {  });
