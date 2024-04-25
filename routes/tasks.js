const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Route handler to get all tasks
router.get('/', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Route handler to get a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route handler to update a task by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route handler to delete a task by ID
router.delete('/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }
      await Task.deleteOne({ _id: req.params.id }); // Delete the task using deleteOne()
      res.json({ msg: 'Task removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Route handler to create a new task
router.post('/', async (req, res) => {
    try {
      const { title, description, dueDate } = req.body;
      
      // Create a new task
      const newTask = new Task({
        title,
        description,
        dueDate
      });
  
      // Save the new task to the database
      await newTask.save();
  
      res.json(newTask);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
