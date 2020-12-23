/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('mrole', {
        roleid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        modnameid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        accesstype: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        recordstate: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue:true

        },
        mroleid: {
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
        }

    }, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        tableName: 'mrole'
    });
};
