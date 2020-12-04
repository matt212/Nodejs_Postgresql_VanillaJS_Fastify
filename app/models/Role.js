/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('role', {
        rolename: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        roleid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        recordstate: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'active'
        },

    }, {
     
        timestamps: false,
        tableName: 'role'
    });
};