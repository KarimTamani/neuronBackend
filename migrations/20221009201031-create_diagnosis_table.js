'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("Diagnosis" , { 
      id : {
        type : Sequelize.INTEGER , 
        autoIncrement : true , 
        allowNull : false , 
        primaryKey : true , 

      } , 
      prediction : {
        type : Sequelize.TEXT , 
        allowNull : false , 
      }, 
      confirmation : { 
        type : Sequelize.STRING, 
        allowNull : true 
      }, 
     
      userId : { 
        type : Sequelize.INTEGER , 
        allowNull : false , 
        onDelete: "CASCADE",
        references: {
            model: "Users",
            key: "id"
        } 
      }
    })
    
  },

  async down (queryInterface, Sequelize) {
    
    return queryInterface.dropTable("Diagnosis") ; 
  }
};
