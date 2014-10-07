'use strict';

var choreTimes = require('../controllers/choreTimes');

// ChoreTime authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.choreTime.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(ChoreTimes, app, auth) {

  app.route('/choreTimes')
    .get(choreTimes.all)
    .post(auth.requiresLogin, choreTimes.create);
  app.route('/choreTimes/:choreTimeId')
    .get(choreTimes.show)
    .put(auth.requiresLogin, hasAuthorization, choreTimes.update)
    .delete(auth.requiresLogin, hasAuthorization, choreTimes.destroy);

  app.route('/choreSessions/:memberId')
    .get(choreTimes.getOpenSessions)
    .put(auth.requiresLogin, hasAuthorization, choreTimes.startChores)
    .delete(auth.requiresLogin, hasAuthorization, choreTimes.stopChores); 

  // Finish with setting up the choreTimeId param
  app.param('choreTimeId', choreTimes.choreTime);
};
