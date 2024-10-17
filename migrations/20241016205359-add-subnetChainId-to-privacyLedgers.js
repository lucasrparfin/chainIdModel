module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PrivacyLedgers', 'subnetChainId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'PrivacyLedgers',
        key: 'chain_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PrivacyLedgers', 'subnetChainId');
  },
};
