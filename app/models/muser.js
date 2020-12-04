/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('muser', {
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isactive: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        muserid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        recordstate: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        created_date: {
            field: 'created_date',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('NOW')
        },
        updated_date: {
            field: 'updated_date',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('NOW')
        },

    }, {
        timestamps: false,
        tableName: 'muser'
    });
};