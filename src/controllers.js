// src/controllers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Task } = require('./models');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)  
  // Verificar se todos os campos foram preenchidos
  if (!username || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  try {
    // Verificar se o usuário já existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(200).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error); // Logar o erro para facilitar a depuração
    res.status(500).json({ message: 'Erro ao cadastrar' });
  }
};


exports.login = async (req, res) => {
  console.log(req.body);
  
  const { username, password } = req.body;
  console.log(username, password);
  
  const user = await User.findOne({ username });
  console.log(user);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.createTask = async (req, res) => {
  const { title } = req.body;
  const task = new Task({ userId: req.userId, title });
  await task.save();
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: id, userId: req.userId },
    { title, completed },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
};


exports.getUsers = async (req, res) => {
  const users = await Task.find();
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await Task.findOneAndDelete({ _id: id, userId: req.userId });
  if (!user) return res.status(404).json({ message: 'user not found' });
  res.json({ message: 'user deleted' });
};


