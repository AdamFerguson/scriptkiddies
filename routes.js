var routes = require('./routes/index'),
    user = require('./routes/user'),
    store = require('./routes/store'),
    household = require('./routes/household');
    tract = require('./routes/tract');

module.exports = function(app) {

  app.get('/', routes.index);
  app.get('/users', user.list);
  app.get('/stores/:storeId/households',household.byStoreId);
  app.get('/stores', store.list);
  app.get('/households/search/bounds', household.searchByBounds);
  app.get('/households/search/tracts', household.searchByTracts);
  app.get('/households', household.list);
  app.get('/tracts', tract.list);
};
