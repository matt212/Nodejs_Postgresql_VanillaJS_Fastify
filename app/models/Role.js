/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('role', {
        rolename: {
            type: DataTypes.STRING(45),
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
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },

    }, {
     
        timestamps: false,
        tableName: 'role'
    });
};