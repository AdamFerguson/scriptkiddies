require.config({
  shim: {
    'd3': { exports: 'd3' },
    'foundation': ['jquery'],
    'leaflet': { exports: 'L' },
    'leaflet-label':['leaflet'],
    'leaflet-markercluster': ['leaflet'],
    'locationfilter':['leaflet'],
    'socketio': {},
    'streamable': {
      deps: ['jquery', 'socketio'],
      exports: 'Streamable'
    },
    'underscore': { exports: '_' }
  },

  paths: {
    'leaflet-label':         'vendor/leaflet.label',
    'leaflet-markercluster': 'vendor/leaflet.markercluster',
    d3:                      'vendor/d3.v3',
    foundation:              'vendor/foundation.min',
    jquery:                  'vendor/jquery-1.9.1.min',
    leaflet:                 'vendor/leaflet',
    locationfilter:          'vendor/locationfilter',
    socketio:                'vendor/socket.io',
    streamable:              'vendor/streamable',
    underscore:              'vendor/underscore-min'
  }
});

require(['app'], function(app) { });
