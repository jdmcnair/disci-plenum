'use strict';

var members = require('../controllers/members');

// family authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.member.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

// The Package is past automatically as first parameter
module.exports = function(FamilyAdmin, app, auth, database) {

  app.route('/familyMember')
    .get(auth.requiresLogin, members.getFamilyMembership);

  app.route('/members')
    .get(auth.requiresLogin, members.isFamilyMember, members.all)
    .post(auth.requiresLogin, members.isFamilyMember, members.create);
  app.route('/members/chores')
    .get(auth.requiresLogin, members.isFamilyMember, members.allWithChores)
    .post(auth.requiresLogin, members.isFamilyMember, members.create);    
  app.route('/members/:memberId')
    .get(auth.requiresLogin, members.isFamilyMember, members.show)
    .put(auth.requiresLogin, hasAuthorization, members.isFamilyMember, members.update)
    .delete(auth.requiresLogin, hasAuthorization, members.isFamilyMember, members.destroy);

  // Finish with setting up the articleId param
  app.param('memberId', members.member);  
};
