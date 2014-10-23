'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TaskSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  verifyingTeacher: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * ChoreList Schema
 */
var ChoreListSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  learner: {
    type: Schema.ObjectId,
    ref: 'Member'
  },
  tasks: [TaskSchema],
  isComplete: {
    type: Boolean,
    required: true,
    default: false
  }
});

/**
 * Validations
 */
ChoreListSchema.path('learner').validate(function(learner) {
  return !!learner;
}, 'Learner cannot be blank');
ChoreListSchema.path('createdBy').validate(function(createdBy) {
  return !!createdBy;
}, 'CreatedBy cannot be blank');

TaskSchema.path('title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

/**
 * Statics
 */
ChoreListSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  })
  .populate('tasks')
  // .populate('createdBy', 'name')
  // .populate('learner', 'name')
  .exec(cb);
};

mongoose.model('Task', TaskSchema);
mongoose.model('ChoreList', ChoreListSchema);
