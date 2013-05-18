
(function() {
  var foursquare, params;

  querystring = require('querystring');
  foursquare = (require('foursquarevenues'))("FGVRGSPLISPSNPO4TPI1Q31HIJTP333FWYLG50CHHAL1HU3I", "4NMUTMDRBO4VIRBQLF4PYNIYYA5EAQ2ZI0M2HW4SXH2WWVLV");

  params = {
    "ll": "40.7,-74"
  };

  foursquare.getVenues(params, function(error, venues) {
    return console.log(!error ? venues : error);
  });

  foursquare.exploreVenues(params, function(error, venues) {
    return console.log(!error ? venues : error);
  });

}).call(this);