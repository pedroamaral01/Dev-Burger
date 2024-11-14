'use strict';

const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('products', 'category');
  },

  async down(queryInterface) {
    await queryInterface.addColumn('products', 'category', {
      category: {
        type: Sequelize.toString,
        allowNull: true,
      },
    });
  },
};
