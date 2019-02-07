/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permits', {
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
    company_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    fair_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    location_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id'
      }
    },
    allowed: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
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
    tableName: 'permits'
  });
};
