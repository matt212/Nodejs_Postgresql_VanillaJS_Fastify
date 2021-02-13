/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mroleset', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    genderid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    roleid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modnameid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mrolesetid: {
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
    tableName: 'mroleset'
  });
};