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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
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
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Member', MemberSchema);
