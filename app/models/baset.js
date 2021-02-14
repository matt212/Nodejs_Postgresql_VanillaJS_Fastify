/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('baset', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accesstype: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    basetid: {
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
    tableName: 'baset'
  });
};