'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Categories", [
      {
        name: "NodeJs",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ReactJs",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ReactNative",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Flutter",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Laravel",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "VueJs",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories",null, {});
  }
};
