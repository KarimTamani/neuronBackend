import Sequelize from "sequelize";

module.exports = (Sequelize, DataTypes) => {

  var diagnosis = Sequelize.define("Diagnosis", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,

    },
    prediction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    confirmation: {
      type: DataTypes.STRING,
      allowNull: true
    },

    imei: {
      type: DataTypes.STRING,
      allowNull: true 
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id"
      }
    }
  }, {
    tableName: "Diagnosis"
  })

  diagnosis.associate = (db) => {
    diagnosis.belongsTo(db.User, {
      foreignKey: "userId",
      as: "doctor"
    })
  }

  return diagnosis
}