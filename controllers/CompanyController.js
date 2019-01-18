const Sequelize = require('sequelize');
const Config = require('../config.json');
const connection = new Sequelize(Config.db, Config.username, Config.password, {dialect: Config.dialect});
const { check, body, validationResult } = require('express-validator/check');

const companies = require('../models/companies.js');
const users = require('../models/users.js');
const fairs = require('../models/fairs.js');
const permits = require('../models/permits.js');
const permitAdditionals = require('../models/permit_additionals.js');
const additionals = require('../models/additionals.js');

const Company = new companies(connection, Sequelize);
const User = new users(connection, Sequelize);
const Permit = new permits(connection, Sequelize);
const Fair = new fairs(connection, Sequelize);
const PermitAdditional = new permitAdditionals(connection, Sequelize);
const Additional = new additionals(connection, Sequelize);



module.exports.newPermitValidation = [
	body('fair_id', 'There is no selected FAIR!').exists(),
	body('company_id', 'There is no selected company!').exists()
];
/**
 * POST request for new permit in the fair
 */
module.exports.newpermit = async function(req, res){
	try{
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}

		let findFair = await Fair.findByPk(req.body.fair_id);  
		let findCompany = await Company.findByPk(req.body.company_id);
		
		let alreadyPermited = await Permit.findOne({
			where: {
				fair_id: findFair.id,
				company_id: findCompany.id
			}
		});

		if(alreadyPermited)
			throw "You have already requested participation for this fair!";

		let permit = await Permit.create({
			fair_id: findFair.id,
			company_id: findCompany.id
		});


		// foreach aditional
		for(let additionalID of req.body.additionals_id){
			let addingAdditional = await Additional.findByPk(additionalID); 

			if(addingAdditional && addingAdditional.fair_id !== findFair.fair_id)
				PermitAdditional.create({
					permit_id: permit.id,
					additional_id: addingAdditional.id
				});
			else 
				throw "There is no additonal under " + additionalID + " id!";
		}


		res.json({
			successMessage: 'The request has been sent!',
			permit
		})
	}
	catch(e){
		res.status(403).json({errorMessge: e})		
	}

}



module.exports.findCompanyValidation = [
	check('id', 'There is id for the company!').exists(),
];
/**
 * Finds company by id
 */
module.exports.findCompany = async (req, res) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}

		let foundedCompany = await Company.findByPk(req.query.id);

		if(!foundedCompany)
			throw "Company not found!";

		res.json(foundedCompany);
	}
	catch(e){
		res.status(403).json({errorMessage: e});
	}
};
