var config = {
  secrets: {
    clientId: 'V5GNNT1YOKWVKQCYM4PUGWOTJGHKKRM4ZYSUFSNUPD0A5ESZ',
    clientSecret: 'B0XA5ASKPDGOQIC03OOX1MHDGU2PUYSYNYUEN3DR2JMLIZ40',
    redirectUrl: 'http://scriptkiddies.adam-ferguson.com/foursquare-redirect'
  }
};

var Foursquare = module.exports = require('node-foursquare')(config);


// API's available without OAuth authentication

// Foursquare.Checkins.getLikes(502bcde16de4146b7f104ac6) : OK
// Foursquare.Events.getEvent(4e173d2cbd412187aabb3c04) : OK
// Foursquare.Events.search(domain=songkick.com,eventId=8183976) : OK
// Foursquare.Events.getCategories() : OK
// Foursquare.Lists.getFollowers(4e4e804fd22daf51d267e1dd) : OK
// Foursquare.Lists.getList(4e4e804fd22daf51d267e1dd) : OK
// Foursquare.Specials.getConfiguration('4c06d48086ba62b5f05988b3') : OK
// Foursquare.Specials.getSpecial('4c06d48086ba62b5f05988b3', '4e0deab3922e6f94b1410af3') : OK
// Foursquare.Tips.getDone(4e5b969ab61c4aaa3e183989) : OK
// Foursquare.Tips.getListed(4e5b969ab61c4aaa3e183989) : OK
// Foursquare.Tips.getLikes(4e5b969ab61c4aaa3e183989) : OK
// Foursquare.Tips.getTip(4b5e662a70c603bba7d790b4) : OK
// Foursquare.Specials.search(40.7, -74) : OK
// Foursquare.Tips.search(40.7, -74) : OK
// Foursquare.Users.getUser(33) : OK
// Foursquare.Venues.getHereNow('5104') : OK
// Foursquare.Venues.getEvents('40afe980f964a5203bf31ee3') : OK
// Foursquare.Venues.getHours('40afe980f964a5203bf31ee3') : OK
// Foursquare.Venues.getLikes('40afe980f964a5203bf31ee3') : OK
// Foursquare.Venues.getLinks('5104') : OK
// Foursquare.Venues.getListed('40afe980f964a5203bf31ee3') : OK
// Foursquare.Venues.getMenu('40afe980f964a5203bf31ee3') : OK
// Foursquare.Venues.getSimilar('40afe980f964a5203bf31ee3') : OK
// Foursquare.Venues.explore(40.7, -74) : OK
// Foursquare.Venues.getCategories() : OK
// Foursquare.Venues.getSuggestcompletion('40.7', '-74', 'foursqu') : OK
// Foursquare.Venues.getPhotos('5104') : OK
// Foursquare.Venues.getTrending(40.7, -74) : OK
// Foursquare.Venues.search(40.7, -74) : OK
// Foursquare.Venues.getTips('5104') : OK
// Foursquare.Venues.getVenue('5104') : OK

// API's only available through OAuth

// Foursquare.Venues.getManaged() :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getLeaderboard() :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.search(twitter=naveen) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getPhotos(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getRequests() :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getTips(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getUser(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getTodos(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getVenueHistory(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Updates.getNotifications() :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getBadges(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getCheckins(self) :  ERROR: Error: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getFriends(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getLists(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Users.getMayorships(self) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Settings.getSettings() :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Settings.getSetting('receivePings') :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Lists.getSuggestedTips(4e4e804fd22daf51d267e1dd, v4bc49ceff8219c74ea97b710) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Lists.getSuggestedVenues(4e4e804fd22daf51d267e1dd) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Photos.getPhoto(4d0fb8162d39a340637dc42b) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Lists.getSuggestedPhotos(4e4e804fd22daf51d267e1dd, v4bc49ceff8219c74ea97b710) :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Checkins.getCheckin(502bcde16de4146b7f104ac6) :  ERROR: 403: Cannot view this checkin (must be friends with this user or provide valid signature).
// Foursquare.Updates.getUpdate('[xxxx]') :  ERROR: Cannot test: Foursquare does not supply a mock.
// Foursquare.Venues.getSimilar('40afe980f964a5203bf31ee3') :  ERROR: Cannot test: Foursquare does not supply a mock.
// Foursquare.Venues.getTimeseries('40afe980f964a5203bf31ee3') :  ERROR: Cannot test: Foursquare does not supply a mock.
// Foursquare.Checkins.getRecentCheckins() :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
// Foursquare.Checkins.addCommentToCheckin(50c409cbe4b092542cc01fa8, 'Hello world!') :  ERROR: 401: Missing oauth_token. See https://developer.foursquare.com/docs/oauth.html for details.
