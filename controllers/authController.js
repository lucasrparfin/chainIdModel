const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'Invalid user or password.' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ auth: false, token: null, message: 'Invalid user or password.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, config.secret, {
      expiresIn: 86400, // Expira em 24 horas
    });    

    return res.status(200).json({ auth: true, token });
  } catch (error) {
    return res.status(500).json({ message: 'Error on the server.', error });
  }
};

exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ message: 'This username is unavailable.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      role: role,
    });

    return res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user.', error });
  }
};
