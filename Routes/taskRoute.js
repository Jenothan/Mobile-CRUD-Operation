const express = require('express');                                                             // import express

const router = express.Router();                                                                // create new object

const { createTask, getTasks, getSingleTask, updateTask, deleteTask } = require("../Controllers/TaskController");       // import Tasks from TaskConroller

router.post('/', createTask);                                                                   // defines a POST route to create a new task 

router.get('/', getTasks);                                                                      // defines GET route to get all tasks

router.get('/:id', getSingleTask);                                                              // defines GET route to get a single tasks

router.patch('/:id', updateTask);                                                               // defines PATCH route to  update a task

router.delete('/:id', deleteTask);                                                              // defines DELETE route to  delete a task

module.exports = router;                                                                        // export router to other files