'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ChoreSessionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  start: {
    type: Date,
    required: true,
    default: Date.now
  },
  stop: {
    type: Date
  },
  secondsDuration: {
    type: Number
  },
  remainingDuration: {
    type: Number
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
  isFullyContributed: {
    type: Boolean,
    required: true,
    default: false
  }
});

/**
 * Validations
 */
ChoreSessionSchema.path('learner').validate(function(learner) {
  return !!learner;
}, 'Learner cannot be blank');

/**
 * Statics
 */
ChoreSessionSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  })
  .populate('learner', 'name')
  .exec(cb);
};

mongoose.model('ChoreSession', ChoreSessionSchema);
