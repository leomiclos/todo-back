// src/routes.js
const express = require('express');
const { register, login, createTask, getTasks, updateTask, deleteTask, getUsers, deleteUser } = require('./controllers');
const { authenticate } = require('./middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(authenticate);

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);


router.get('/users', getUsers);
router.delete('/users', deleteUser);

module.exports = router;
