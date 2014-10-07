'use strict';

var members = require('../controllers/members');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.member.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

// The Package is past automatically as first parameter
module.exports = function(FamilyAdmin, app, auth, database) {

  app.get('/familyAdmin/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/familyAdmin/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/familyAdmin/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/familyAdmin/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/familyAdmin/example/render', function(req, res, next) {
    FamilyAdmin.render('index', {
      package: 'family-admin'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });



  app.route('/members')
    .get(members.all)
    .post(auth.requiresLogin, members.create);
  app.route('/members/chores')
    .get(members.allWithChores)
    .post(auth.requiresLogin, members.create);    
  app.route('/members/:memberId')
    .get(members.show)
    .put(auth.requiresLogin, hasAuthorization, members.update)
    .delete(auth.requiresLogin, hasAuthorization, members.destroy);

  // Finish with setting up the articleId param
  app.param('memberId', members.member);  
};
