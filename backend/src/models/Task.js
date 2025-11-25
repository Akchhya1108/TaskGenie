const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'urgent', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  dueDate: {
    type: Date
  },
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  aiSuggestions: {
    type: [String],
    default: []
  },
  tags: [String],
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Mark as completed
taskSchema.methods.markComplete = function() {
  this.completed = true;
  this.completedAt = Date.now();
  this.status = 'completed';
};

module.exports = mongoose.model('Task', taskSchema);