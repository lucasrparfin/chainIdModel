const User = require('./user');
const ChainID = require('./chainID');

// Estabelecendo as associações
User.hasMany(ChainID, {
  foreignKey: 'userId',
  as: 'chainIds'
});

ChainID.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = { User, ChainID };
