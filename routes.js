var routes = require('./routes/index'),
    user = require('./routes/user'),
    store = require('./routes/store'),
    household = require('./routes/household');

module.exports = function(app) {

  app.get('/', routes.index);
  app.get('/users', user.list);
  app.get('/stores', store.list);
  app.get('/households', household.list);
};
