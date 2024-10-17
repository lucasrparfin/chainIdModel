const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const PrivacyLedger = sequelize.define('PrivacyLedger', {
  chain_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  nodeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rpcUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subnetChainId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'PrivacyLedger',
      key: 'chain_id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
});

PrivacyLedger.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PrivacyLedger.belongsTo(PrivacyLedger, {
  as: 'subnet',
  foreignKey: 'subnetChainId',
  targetKey: 'chain_id'
});

module.exports = PrivacyLedger;
