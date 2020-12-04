/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "modname",
    {
      mname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      recordstate: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      modnameid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      created_date: {
        field: "created_date",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW")
      },
      updated_date: {
        field: "updated_date",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW")
      }
    },
    {
      timestamps: false,
      tableName: "modname"
    }
  );
  // models.modname.sync({alter: true}).then(function() {
  // }).catch(e => {
  //     console.log(e)
  // })
  /*sequelize.sync({force: true, match: /_dev$/})
  .then(() => {
    return modname.create();
  })
  .then((post) => {
    console.log(modname.get({plain: true}));

    console.log(modname.createdAt);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => sequelize.close());*/
};
