'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Member = mongoose.model('Member'),
  Family = mongoose.model('Family'),
  // async = require('async'),
  _ = require('lodash');


/**
 * Find member by id
 */
exports.member = function(req, res, next, id) {
  Member.load(id, function(err, member) {
    if (err) return next(err);
    if (!member) return next(new Error('Failed to load member ' + id));
    req.member = member;
    next();
  });
};

/**
 * Find member by user id
 */
exports.getFamilyMembership = function(req, res) {
  var id = req.user.id;

  Member.loadFromUserId(id, function(err, member) {
    console.log('inner id: ' + id);

    if (err) res.json(500, {
        error: 'Cannot save the member'
      });
    else {
      res.json(member ? member : 0);
    }
  });
};

/**
 * Find member by user id
 */
exports.isFamilyMember = function(req, res, next) {
  var id = req.user.id;

  console.log('id: ' + id);

  Member.loadFromUserId(id, function(err, member) {
    console.log('inner id: ' + id);

    if (err) return next(err);
    if (!member || !member.family) return next(new Error('Failed to load member and family from user ' + id));

    console.log('member: ' + member.name + member.family.name);


    req.currentMember = member;
    req.currentFamily = member.family;
    next();
  });
};

/**
 * Create an member
 */
exports.create = function(req, res) {
  var member = new Member(req.body);
  member.createdByUser = req.user;
  member.family = req.currentFamily;

  member.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(500, {
        error: 'Cannot save the member'
      });
    }
    res.json(member);

  });
};

/**
 * Update an member
 */
exports.update = function(req, res) {
  var member = req.member;

  member = _.extend(member, req.body);
  member.family = req.currentFamily;

  member.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the member'
      });
    }
    res.json(member);

  });
};

/**
 * Delete an member
 */
exports.destroy = function(req, res) {
  var member = req.member;

  member.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the member'
      });
    }
    res.json(member);

  });
};

/**
 * Show an member
 */
exports.show = function(req, res) {
  res.json(req.member);
};

/**
 * List of Members
 */
exports.all = function(req, res) {
  var family = req.currentFamily;

  Member.find({ family: family._id }).sort('-created').populate('user', 'name username').exec(function(err, members) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the members'
      });
    }
    res.json(members);
  });
};

/**
 * List of Articles
 */
exports.allWithChores = function(req, res) {
  var family = req.currentFamily;

  Member.find({ isParent: false, family: family._id }).sort('-created')
  .populate('user', 'name username')
  .populate('choreTimes', 'reason secondsDuration remainingDuration')
  .populate('currentSession', 'start')
  .exec(function(err, members) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the members'
      });
    }
    res.json(members);
  });
};  

/**
 * Create an member
 */
exports.createFamily = function(req, res) {
  var family = new Family();
  family.name = 'The McNairs';

  family.user = req.user;

  family.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the family'
      });
    }
    res.json(family);

  });
};

/**
 * Create an member
 */
exports.createMemberClaim = function(req, res) {
  console.log('inside createMemberClaim');

  //console.log(req);

  var memberId = req.body.member._id;

  Member.load(memberId, function(err, member) {
    if (err || !member) {
      res.json(500, {
        error: 'Cannot claim the member'
      });
    }

    member.user = req.user;

    member.save(function(err) {
      console.log(err);
      if (err) {
        res.json(500, {
          error: 'Cannot claim the member'
        });
      }
      else {
        res.json(member);
      }
    }); 
  });  
};