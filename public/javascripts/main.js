require.config({
  shim: {
    'foundation': ['jquery'],
    'leaflet': {
      exports: 'L'
    },
    'd3': {
      exports: 'd3'
    },
    'underscore': {
      exports: '_'
    },
    'leaflet-markercluster': ['leaflet'],
    'leaflet-label':['leaflet'],
    'locationfilter':['leaflet']
  },

  paths: {
    foundation:              'vendor/foundation.min',
    jquery:                  'vendor/jquery-1.9.1.min',
    leaflet:                 'vendor/leaflet',
    d3:                      'vendor/d3.v3',
    underscore:              'vendor/underscore-min',
    'leaflet-markercluster': 'vendor/leaflet.markercluster',
    'leaflet-label':         'vendor/leaflet.label',
    locationfilter:          'vendor/locationfilter'
  }
});

require(['app'], function(app) { });
