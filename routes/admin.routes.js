const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const Sequelize = require('sequelize');

const app = express();

const sequelize = new Sequelize('jobfair', 'root', '', {dialect: 'mysql'});

const LoginController = require('../controllers/LoginController.js');
const FairController = require('../controllers/FairController.js');

const fairs = require('../models/fairs.js');
const admins = require('../models/admins.js');

const Admin = new admins(sequelize, Sequelize);

var router = express.Router();


// admin authorization
router.use(function(req, res, next){
    let userToken = req.header('Authorization');
    if(userToken){
        let splitedToken = userToken.split(' ');
    
        userToken = splitedToken[1];
        try{
            jwt.verify(userToken, config.secret, (errorMessage, decodedData) => {
                // token verified 
                console.log(JSON.stringify(decodedData));
                Admin.findOne({
                    where: { id: decodedData.foundedUser.id }
                })
                .then((response) => {
                    if(response)
                        next();
                    else 
                        res.status(403).json({ errorMessage: 'User is not Admin to access this route'});
                });
            })
        }
        catch(err){
            res.status.json( {errorMessage: 'Token is not valid'} )
        }
    }
    else 
        res.status(403).json({ errorMessage : 'Missing token authorization'} );
});


router.get('/fairs', FairController.fairs);


// export router 
module.exports = router;
