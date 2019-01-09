/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('items', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    package_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'packages',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'items'
  });
};
