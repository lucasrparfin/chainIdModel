const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const ChainID = sequelize.define('ChainID', {
  chain_id: {
    type: DataTypes.INTEGER, // Tipo inteiro
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'chain_ids',
});

module.exports = ChainID;
