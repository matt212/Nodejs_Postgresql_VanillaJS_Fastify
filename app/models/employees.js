/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('employees', {
        employeesid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(16),
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        birth_date: {
            type: DataTypes.DATE,
            allowNull: true
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
        tableName: 'employees'
    });
};