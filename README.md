# Requirements

- MongoDB >= 2.4
- NodeJS >= 0.10
- ExpressJS installed globally (available through `npm install -g express`)

node modules are kept in the repo to go along with suggested best practices


# Data import

To import data run: `./jake import_data`


# Geospatial querying

When using mongoose, you can execute geospatial queries like:

- Inclusion:

```javascript
var lngLow  = -80.75;
var lngHigh = -80.8;
var latLow  = 35.3;
var latHigh = 35.4;
var geojsonPoly = { type: 'Polygon', coordinates: [[lngLow,latLow], [lngLow,latHigh], [lngHigh,latLow], [lngHigh,latHigh]] };
```
