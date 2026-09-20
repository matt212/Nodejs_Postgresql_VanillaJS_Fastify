/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rideit', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    my_orders: {
      type: DataTypes.STRING,
      allowNull: true
    },
    my_returns: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rideitid: {
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
    tableName: 'rideit'
  });
};