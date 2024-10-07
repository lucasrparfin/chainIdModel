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

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // Expira em 24 horas
    });

    return res.status(200).json({ auth: true, token });
  } catch (error) {
    return res.status(500).json({ message: 'Error on the server.', error });
  }
};
