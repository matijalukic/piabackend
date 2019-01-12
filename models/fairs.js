/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fairs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    place: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    startCV: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endCV: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startParticipate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endParticipate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'fairs',
    timestamps: false,
  });
};
