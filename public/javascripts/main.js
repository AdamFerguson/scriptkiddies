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
    foundation:              'foundation.min',
    jquery:                  'jquery-1.9.1.min',
    leaflet:                 'leaflet',
    d3:                      'd3.v3',
    underscore:              'underscore-min',
    'leaflet-markercluster': 'leaflet.markercluster',
    'leaflet-label':         'leaflet.label',
    locationfilter:          'locationfilter'
  }
});

require(['app'], function(app) { });
