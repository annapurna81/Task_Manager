const express  = require('express');
const protect  = require('../middleware/authMiddleware');
const {
  getTasks, createTask, updateTask, deleteTask
} = require('../controllers/taskController');

const router = express.Router();

// All routes below require a valid JWT token
router.use(protect);

router.get   ('/',    getTasks);
router.post  ('/',    createTask);
router.put   ('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
