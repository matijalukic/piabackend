const Sequelize = require('sequelize');
const fairs = require('../models/fairs.js');

const sequelize = new Sequelize('jobfair', 'root', '', {dialect: 'mysql'});
const Fair = new fairs(sequelize, Sequelize);


module.exports.fairs = (req, res) => {
    try {
        Fair.findAll()
            .then((fairs) => {
                res.status(200).json(fairs);
            });
    }
    catch (e) {
        console.log('FairController::fairs:' + e);
        res.status(403).json({errorMessage: e});
    }
};
