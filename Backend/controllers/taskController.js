/*
  controllers/taskController.js
  ──────────────────────────────
  CRUD operations for tasks.
  All routes are protected — user must be logged in (JWT verified by middleware).
  Users can only see and edit THEIR OWN tasks (filtered by owner: req.user._id).

  CRUD = Create, Read, Update, Delete
  ─────────────────────────────────────
  GET    /api/tasks         → get all tasks for logged-in user
  POST   /api/tasks         → create a new task
  PUT    /api/tasks/:id     → update a task (title, description, status, dueDate)
  DELETE /api/tasks/:id     → delete a task
*/

const Task = require('../models/Task');

// ── GET all tasks ─────────────────────────────────────────────────────────────
async function getTasks(req, res) {
  try {
    // Only fetch tasks belonging to the logged-in user
    // Optionally filter by status: GET /api/tasks?status=todo
    const filter = { owner: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });

  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}

// ── CREATE a task ─────────────────────────────────────────────────────────────
async function createTask(req, res) {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status:      status      || 'todo',
      dueDate:     dueDate     || null,
      owner:       req.user._id,
    });

    res.status(201).json({ message: 'Task created!', task });

  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}

// ── UPDATE a task ─────────────────────────────────────────────────────────────
async function updateTask(req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not yours.' });
    }

    // Update only the fields provided in the request body
    const { title, description, status, dueDate } = req.body;
    if (title       !== undefined) task.title       = title;
    if (description !== undefined) task.description = description;
    if (status      !== undefined) task.status      = status;
    if (dueDate     !== undefined) task.dueDate     = dueDate;

    await task.save();
    res.json({ message: 'Task updated!', task });

  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}

// ── DELETE a task ─────────────────────────────────────────────────────────────
async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({
      _id:   req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not yours.' });
    }

    res.json({ message: 'Task deleted!' });

  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
