'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    return queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true

      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true

      },
      password: {
        type: Sequelize.STRING ,
        allowNull: false
      },
      occupation : { 
        type : Sequelize.STRING 
      }, 

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    }, {
      timestamps : true 
    })

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Users");

  }
};
