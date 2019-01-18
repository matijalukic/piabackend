/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permit_additionals', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    permit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    additional_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'permit_additionals'
  });
};
