'use strict';

const bcrypt = require('bcryptjs'); // Para criptografar a senha do usuário

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Cria a tabela de usuários
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Insere o primeiro usuário no banco
    const passwordHash = bcrypt.hashSync('admin', 8);

    await queryInterface.bulkInsert('users', [{
      username: 'admin',
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Exclui a tabela de usuários
    await queryInterface.dropTable('users');
  }
};
