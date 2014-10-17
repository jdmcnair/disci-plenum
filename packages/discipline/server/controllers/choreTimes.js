'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  ChoreTime = mongoose.model('ChoreTime'),
  ChoreSession = mongoose.model('ChoreSession'),
  SessionContribution = mongoose.model('SessionContribution'),
  Member = mongoose.model('Member'),
  _ = require('lodash');


/**
 * Find member by user id
 */
exports.isFamilyMember = function(req, res, next) {
  var id = req.user.id;

  //console.log('id: ' + id);

  Member.loadFromUserId(id, function(err, member) {
    //console.log('inner id: ' + id);

    if (err) return next(err);
    if (!member || !member.family) return next(new Error('Failed to load member and family from user ' + id));

    //console.log('member: ' + member.name + member.family.name);

    req.currentMember = member;
    req.currentFamily = member.family;
    next();
  });
};

/**
 * Find choreTime by id
 */
exports.choreTime = function(req, res, next, id) {
  ChoreTime.load(id, function(err, choreTime) {
    if (err) return next(err);
    if (!choreTime) return next(new Error('Failed to load choreTime ' + id));
    req.choreTime = choreTime;
    next();
  });
};

/**
 * Create an choreTime
 */
exports.create = function(req, res) {

  var choreTime = new ChoreTime(req.body);
  choreTime.teacher = req.user;
  choreTime.remainingDuration = choreTime.secondsDuration;

  choreTime.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(500, {
        error: 'Cannot save the choreTime'
      });
    }

    Member.load(choreTime.learner, function(err, learner){
      learner.choreTimes.push(choreTime._id);
      learner.save();
    });

    res.json(choreTime);

  });
};

/**
 * Update an choreTime
 */
exports.update = function(req, res) {
  var choreTime = req.choreTime;

  choreTime = _.extend(choreTime, req.body);

  choreTime.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the choreTime'
      });
    }
    res.json(choreTime);

  });
};

/**
 * Delete an choreTime
 */
exports.destroy = function(req, res) {
  var choreTime = req.choreTime;

  choreTime.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the choreTime'
      });
    }
    res.json(choreTime);

  });
};

/**
 * Show an choreTime
 */
exports.show = function(req, res) {
  res.json(req.choreTime);
};

/**
 * List of ChoreTimes
 */
exports.all = function(req, res) {
  //console.log(req.currentFamily.name);
  var familyId = req.currentFamily._id;

  Member.find({family: familyId}).exec(function(err, members){
    var ids = members.map(function(member) { return member._id; });

    ChoreTime
    .find({ learner: { $in: ids}, remainingDuration: { $gt: 0 } })
    .sort('-created')
    .populate('teacher', 'name username')
    .populate('learner', 'name username')
    .exec(function(err, choreTimes) {
      if (err) {
        return res.json(500, {
          error: 'Cannot list the choreTimes'
        });
      }
      res.json(choreTimes);

    });
  });
};

function updateChoreTimesForSession(choreTimes, session){

  var sessionDuration = session.secondsDuration;

  _(choreTimes).forEach(function(choreTime){
    console.log('remaining duration: ' + sessionDuration);
    if(sessionDuration > 0){
      var contribution = new SessionContribution();

      if(choreTime.remainingDuration > sessionDuration){
        // add session contribution for entire amount
        contribution.secondsDuration = sessionDuration;
        choreTime.remainingDuration = choreTime.remainingDuration - sessionDuration;
        session.isFullyContributed = true;
        session.remainingDuration = sessionDuration = 0;
      } else {
        contribution.secondsDuration = choreTime.remainingDuration;
        session.remainingDuration = sessionDuration = sessionDuration - choreTime.remainingDuration;
        choreTime.remainingDuration = 0;
        choreTime.isComplete = true;
      }

      contribution.choreTime = choreTime;
      contribution.choreSession = session;

      contribution.save();
      choreTime.contributions.push(contribution);
      session.contributions.push(contribution);
      choreTime.save();
      session.save();
    }
  });

  console.log('seconds: ' + sessionDuration);
}

function stopMemberChores(memberId, callback) {
  Member
  .findOne({ _id: memberId })
  .populate({
    path: 'choreTimes',
    match: { isComplete: false }
  })
  .populate('currentSession')
  .exec(function(err, member){
    var currentSession = member.currentSession;
    if(currentSession) {
      currentSession.stop = Date.now();
      currentSession.save();
      currentSession.secondsDuration = Math.round((currentSession.stop - currentSession.start) / 1000);

      updateChoreTimesForSession(member.choreTimes, currentSession);
    }

    member.currentSession = null;
    member.save();
  });
  ChoreSession.update({ learner: memberId, stop: null}, { stop: Date.now() }, {multi: true}, callback);
}

/**
 * Start a chore session
 */
exports.startChores = function(req, res) {

  function createNewSession() {
    var choreSession = new ChoreSession();
    choreSession.teacher = req.user;
    choreSession.learner = req.body.memberId;

    console.log('inside startChores memberId: ' + req.member._id);


    choreSession.save(function(err) {
      if (err) {
        //console.log(err);
        return res.json(500, {
          error: 'Cannot save the choreSession'
        });
      }

      Member.load(choreSession.learner, function(err, learner){
        learner.currentSession = choreSession._id;
        learner.save();
        res.json(choreSession);
      });
    });    
  }


  stopMemberChores(req.member._id, createNewSession);

};

/**
 * Stop a chore session
 */
exports.stopChores = function(req, res) {
  console.log('in stopChores');
  stopMemberChores(req.member._id, function(){
    res.json({success: true});
  });
};

/**
 * list chore sessions by member
 */
exports.getOpenSessions = function(req, res) {
  ChoreSession
    .find({ learner: req.member._id, stop: null })
    .sort('-created')
    .populate('learner', 'name')
    .exec(function(err, choreSessions) {
      if (err) {
        return res.json(500, {
          error: 'Cannot list the choreSessions'
        });
      }
      res.json(choreSessions);
    });
};

/**
 * Subtracts an amount from chore totals
 */
exports.subtractFromChores = function(req, res) {

  var choreSession = new ChoreSession();
  choreSession.teacher = req.user;
  choreSession.learner = req.body.memberId;
  choreSession.start = choreSession.stop = Date.now();
  choreSession.secondsDuration = req.body.subtractedDuration * 60;

  choreSession.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(500, {
        error: 'Cannot save the choreSession'
      });
    }

    Member
    .findOne({ _id: choreSession.learner })
    .populate({
      path: 'choreTimes',
      match: { isComplete: false }
    })
    .populate('currentSession')
    .exec(function(err, member){
        updateChoreTimesForSession(member.choreTimes, choreSession);
        res.json(choreSession);
    });

  });   
};