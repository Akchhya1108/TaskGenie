const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
  getTaskBreakdown,
  getStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Protect all task routes
router.use(protect);

// Task routes
router.get('/stats', getStats);
router.post('/breakdown', getTaskBreakdown);
router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleComplete);

module.exports = router;