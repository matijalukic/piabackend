/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('persons', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '0'
    },
    surname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '0'
    },
    tel: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'persons'
  });
};
