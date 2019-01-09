/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('companies', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    director: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pib: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    employees: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    agency: {
      type: DataTypes.ENUM('it','telekomunikacije','energetika','gradjevina','masinstvo'),
      allowNull: false
    },
    speciality: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'companies',
    timestamps: false,

  });
};
