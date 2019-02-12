const Sequelize = require('sequelize');
const fairs = require('../models/fairs.js');
const locations = require('../models/locations.js');

const sequelize = new Sequelize('jobfair', 'root', '', {dialect: 'mysql'});
const Fair = new fairs(sequelize, Sequelize);
const Location = new locations(sequelize, Sequelize);


Fair.hasMany(Location, { foreignKey: 'fair_id' });

module.exports.fairs = (req, res) => {
    try {
        Fair.findAll({
            include: [Location],
            order: [['start', 'DESC']]
        })
            .then((fairs) => {
                res.status(200).json(fairs);
            });
    }
    catch (e) {
        console.log('FairController::fairs:' + e);
        res.status(403).json({errorMessage: e});
    }
};
