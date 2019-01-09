/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('additionals', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'additionals'
  });
};
