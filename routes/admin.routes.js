const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const app = express();

const sequelize = new Sequelize('jobfair', 'root', '', {dialect: 'mysql'});

const LoginController = require('../controllers/LoginController.js');
const FairController = require('../controllers/FairController.js');
const AdminController = require('../controllers/AdminController.js');

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
                // Find admin id to verify that user can view
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
            res.status(403).json( {errorMessage: 'Token is not valid'} )
        }
    }
    else 
        res.status(403).json({ errorMessage : 'Missing token authorization'} );
});


// /admin/fairs
router.get('/fairs', FairController.fairs);
// new fair 
router.post('/newfair', bodyParser.json(), AdminController.newfairValidation, AdminController.newfair);

// import json packages
router.post('/newpackages', bodyParser.json(), AdminController.newpackagesValidation, AdminController.newpackages);

// import json fairs 
router.post('/importfairs', bodyParser.json(), AdminController.importFairs);

// upload images
router.post('/uploadimage', AdminController.uploadImage);

// get image
router.get('/image', AdminController.getImage);

// allowing/forbid permit
router.get('/allowpermit', AdminController.allowPermitValidation, AdminController.allowPermit);
router.get('/forbidpermit', AdminController.allowPermitValidation, AdminController.forbidPermit);

// list permits of the fair
router.get('/fair/permits', AdminController.permitsValidation, AdminController.permitsOfFair);

// export router 
module.exports = router;
