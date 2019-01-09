/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('packages', {
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
    video_promotion: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    no_lessons: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    no_workchops: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    no_presentation: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    max_companies: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    fair_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'fairs',
        key: 'id'
      }
    }
  }, {
    tableName: 'packages'
  });
};
