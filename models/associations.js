const User = require('./user');
const PrivacyLedger = require('./privacyLedger');

User.hasMany(PrivacyLedger, { foreignKey: 'userId' });
PrivacyLedger.belongsTo(User, { foreignKey: 'userId' });
