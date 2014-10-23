'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Member = mongoose.model('Member'),
  ChoreList = mongoose.model('ChoreList'),
  _ = require('lodash');


 /**
 * list chore sessions by member
 */
exports.getMemberChoreList = function(req, res) {
	console.log('getMemberChoreList: here!');

	Member.load({_id: req.member._id}, function(err, member){
		if(!member.currentList) res.json(null);
		else {
			ChoreList.load({_id: member.currentList}, function(err, choreList){
		      if (err) {
		        return res.json(500, {
		          error: 'Cannot get the chore list'
		        });
		      }
		      res.json(choreList);
			});
		}
	});
};

function updateOrInsertChoreList(req, res, choreList) {
	choreList.save(function(err) {
	    if (err) {
	      console.log(err);
	      return res.json(500, {
	        error: 'Cannot save the choreList'
	      });
	    }

	    var member = req.member;
	    member.currentList = choreList._id;
	    member.save();

	    // todo: add stuff to link to member

		res.json(choreList);
	});	
}

exports.saveChoreList =  function(req, res) {
	console.log('saveChoreList: here!');

	if(req.body._id){
		ChoreList.load({_id: mongoose.Types.ObjectId(req.body._id)}, function(err, choreList){
	      if (err) {
	      	console.log(err);
	        return res.json(500, {
	          error: 'Cannot get the chore list'
	        });
	      }
	      choreList = _.extend(choreList, req.body);
		  updateOrInsertChoreList(req, res, choreList);
		});
	} else {
		var choreList = new ChoreList(req.body);
		choreList.learner = req.member._id;
		console.log(req.member);

		updateOrInsertChoreList(req, res, choreList);
	}
};