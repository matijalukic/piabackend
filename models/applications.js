/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applications', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: "SET('PRACTICE','JOB')",
      allowNull: true
    },
    student_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    job_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    cover_letter: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pdf: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accepted: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rate: {
      type: DataTypes.INTEGER(4),
      allowNull: true
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
    tableName: 'applications'
  });
};
