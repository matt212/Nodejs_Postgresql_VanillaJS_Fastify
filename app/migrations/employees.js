'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addIndex('employees', ['recordstate', 'birth_date'])

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
