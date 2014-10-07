'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Article Schema
 */
var SessionContributionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  choreTime: {
    type: Schema.ObjectId,
    ref: 'ChoreTime'
  },
  choreSession: {
    type: Schema.ObjectId,
    ref: 'ChoreSession'
  },
  secondsDuration: {
    type: Number,
    required: true
  }
});

/**
 * Validations
 */
SessionContributionSchema.path('choreTime').validate(function(choreTime) {
  return !!choreTime;
}, 'choreTime cannot be blank');
SessionContributionSchema.path('choreSession').validate(function(choreSession) {
  return !!choreSession;
}, 'choreSession cannot be blank');

/**
 * Statics
 */
SessionContributionSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  })
  .exec(cb);
};

mongoose.model('SessionContribution', SessionContributionSchema);
