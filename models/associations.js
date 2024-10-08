const User = require('./user');
const ChainID = require('./chainID');

User.hasMany(ChainID, {
  foreignKey: 'userId',
  as: 'chainIds'
});

ChainID.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = { User, ChainID };
