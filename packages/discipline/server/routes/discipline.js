'use strict';

var choreTimes = require('../controllers/choreTimes');
var choreList = require('../controllers/choreList');

// ChoreTime authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.choreTime.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(ChoreTimes, app, auth) {

  //console.log(members);

  app.route('/choreTimes')
    .get(choreTimes.isFamilyMember, choreTimes.all)
    .post(auth.requiresLogin, choreTimes.isFamilyMember, choreTimes.create);

  app.route('/choreTimes/:choreTimeId')
    .get(choreTimes.show)
    .put(auth.requiresLogin, hasAuthorization, choreTimes.update)
    .delete(auth.requiresLogin, hasAuthorization, choreTimes.destroy);

  app.route('/choreSessions/:memberId')
    .get(choreTimes.getOpenSessions)
    .put(auth.requiresLogin, hasAuthorization, choreTimes.startChores)
    .delete(auth.requiresLogin, hasAuthorization, choreTimes.stopChores); 

  app.route('/choreSessions/:memberId/:subtractedDuration')
    .put(auth.requiresLogin, hasAuthorization, choreTimes.isFamilyMember, choreTimes.subtractFromChores); 

  app.route('/choreList/:memberId')
    .get(choreList.getMemberChoreList)
    .put(auth.requiresLogin, hasAuthorization, choreList.saveChoreList);

  // app.route('/choreList/:memberId/task/:taskId')
  //   .put(auth.requiresLogin, hasAuthorization, choreList.saveChoreTask)
  //   .delete(auth.requiresLogin, hasAuthorization, choreList.deleteChoreTask); 

  // Finish with setting up the choreTimeId param
  app.param('choreTimeId', choreTimes.choreTime);
};
