


module.exports = (Sequelize, DataType) => {
    var user = Sequelize.define("User", {

        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        name: {
            type: DataType.STRING,
            allowNull: true,
        },

        lastname: {
            type: DataType.STRING,
            allowNull: true
        },
        email: {
            type: DataType.STRING,
            allowNull: false,
            unique: true

        },
        phone: {
            type: DataType.STRING,
            allowNull: true ,
            unique: true

        },
        password: {
            type: DataType.STRING,
            allowNull: false
        },
        occupation: {
            type: DataType.STRING
        }

    }, {
        timestamps: true
    });

    user.associate = (db) => {
        user.hasMany(db.Diagnosis, {
            foreignKey: "userId",
            as: "diagnosis"
        });
    };
    return user;
}



