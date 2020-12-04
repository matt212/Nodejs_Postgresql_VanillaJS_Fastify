/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('userrolemapping', {
        roleid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        muserid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isactive: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        userrolemappingid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
            allowNull: false,
            defaultValue: sequelize.fn('NOW')
        },
         recordstate: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue:true

        },

    }, {
        timestamps: false,
        tableName: 'userrolemapping'
    });
};