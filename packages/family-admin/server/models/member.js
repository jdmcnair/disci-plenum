'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Member Schema
 */
var MemberSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  family: {
    type: Schema.ObjectId,
    ref: 'Family',
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdByUser: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isParent: {
    type: Boolean,
    required: true,
    default: false
  },
  choreTimes: [{
    type: Schema.ObjectId,
    ref: 'ChoreTime'
  }],
  currentSession: {
    type: Schema.ObjectId,
    ref: 'ChoreSession'
  }
});

/**
 * Validations
 */
MemberSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');

/**
 * Statics
 */
MemberSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  })
  .populate('user', 'name username')
  .populate('family', 'name')
  .exec(cb);
};

MemberSchema.statics.loadFromUserId = function(userId, cb) {
  this.findOne({
    user: userId
  })
  .populate('user', 'name username')
  .populate('family', 'name')
  .exec(cb);
};

mongoose.model('Member', MemberSchema);
