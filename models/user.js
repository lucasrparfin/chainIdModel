const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('participant', 'admin'),
    allowNull: false,
    defaultValue: 'participant',
  },
}, {
  tableName: 'users',
});

module.exports = User;
