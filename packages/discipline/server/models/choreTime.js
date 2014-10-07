'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ChoreTimeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  secondsDuration: {
    type: Number,
    required: true
  },
  remainingDuration: {
    type: Number,
    required: true
  },
  teacher: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  learner: {
    type: Schema.ObjectId,
    ref: 'Member'
  },
  contributions: [{
    type: Schema.ObjectId,
    ref: 'SessionContribution'
  }],
  isComplete: {
    type: Boolean,
    required: true,
    default: false
  }
});

/**
 * Validations
 */
ChoreTimeSchema.path('reason').validate(function(reason) {
  return !!reason;
}, 'Reason cannot be blank');
ChoreTimeSchema.path('secondsDuration').validate(function(secondsDuration) {
  return !!secondsDuration;
}, 'Reason cannot be blank');
ChoreTimeSchema.path('learner').validate(function(learner) {
  return !!learner;
}, 'Learner cannot be blank');

/**
 * Statics
 */
ChoreTimeSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  })
  .populate('teacher', 'name username')
  .populate('learner', 'name')
  .exec(cb);
};

mongoose.model('ChoreTime', ChoreTimeSchema);
