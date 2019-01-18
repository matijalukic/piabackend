/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admins', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'persons',
        key: 'id'
      }
    }
  }, {
    tableName: 'admins'
  });
};
