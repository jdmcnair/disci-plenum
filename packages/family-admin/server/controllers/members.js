'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Member = mongoose.model('Member'),
  // ChoreTime = mongoose.model('ChoreTime'),
  // async = require('async'),
  _ = require('lodash');


/**
 * Find member by id
 */
exports.member = function(req, res, next, id) {
  console.log('in member');
  Member.load(id, function(err, member) {
    if (err) return next(err);
    if (!member) return next(new Error('Failed to load member ' + id));
    req.member = member;
    next();
  });
};

/**
 * Create an member
 */
exports.create = function(req, res) {
  var member = new Member(req.body);
  member.user = req.user;

  member.save(function(err) {
    if (err) {
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
  //console.log('loadChores: ' + loadChores);
  Member.find().sort('-created').populate('user', 'name username').exec(function(err, members) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the members'
      });
    }
    res.json(members);
    //next();
  });
};

/**
 * List of Articles
 */
exports.allWithChores = function(req, res) {
  Member.find().sort('-created')
  .populate('user', 'name username')
  .populate('choreTimes', 'reason secondsDuration remainingDuration')
  .populate('currentSession', 'start')
  .exec(function(err, members) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the members'
      });
    }

    // var iter = function(member, callback){
    //   //console.log('member: ' + member);
    //   ChoreTime.find({ learner: member._id }).exec(function(err, chores){
    //     if(err){
    //       return res.json(500, {
    //         error: 'Cannot load the chores'
    //       });
    //     }
    //     member.choreTimes = chores;
    //     console.log(member.choreTimes.length);
    //     callback();
    //   });
    // };

    // async.each(members, iter, function(err){
    //   console.log('at end ');
    //   console.log(members[0].choreTimes);
    //   console.log(members[0]);
    // });

// console.log('got here!!!!');
    // _.forEach(members, );
      res.json(members);


  });
};  