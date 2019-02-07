const Sequelize = require('sequelize');
const Config = require('../config.json');
const jwt = require('jsonwebtoken');
const connection = new Sequelize(Config.db, Config.username, Config.password, {dialect: Config.dialect});
const { check, body, validationResult } = require('express-validator/check');
const LoginController = require('./LoginController.js');


const companies = require('../models/companies.js');
const users = require('../models/users.js');
const fairs = require('../models/fairs.js');
const packages = require('../models/packages.js');
const permits = require('../models/permits.js');
const permitAdditionals = require('../models/permit_additionals.js');
const additionals = require('../models/additionals.js');
const jobs = require('../models/jobs.js');
const applications = require('../models/applications.js');
const students = require('../models/students.js');

const Company = new companies(connection, Sequelize);
const User = new users(connection, Sequelize);
const Permit = new permits(connection, Sequelize);
const Fair = new fairs(connection, Sequelize);
const Package = new packages(connection, Sequelize);
const PermitAdditional = new permitAdditionals(connection, Sequelize);
const Additional = new additionals(connection, Sequelize);
const Job = new jobs(connection, Sequelize);
const Application = new applications(connection, Sequelize);
const Student = new students(connection, Sequelize);

// relationships 
Fair.hasMany(Package, { foreignKey: 'fair_id'});
Fair.hasMany(Additional, { foreignKey: 'fair_id'});
Fair.belongsToMany(Company, { through: Permit, foreignKey: 'fair_id', otherKey: 'company_id' });
Fair.hasMany(Permit, { foreignKey: 'fair_id'});

Company.hasMany( Job, {foreignKey: 'company_id'} );
Job.hasMany( Application, { foreignKey: 'job_id' });
Application.belongsTo(Job, { foreignKey: 'job_id' });
Application.belongsTo(Student, { foreignKey: 'student_id' });
Application.belongsTo(User, { foreignKey: 'student_id' });
/**
 * Authorization
 */
module.exports.authorization = function(req, res, next){
	try{

		let userToken = req.header('Authorization');
		if(userToken){
			
			let splitedToken = userToken.split(' ');
		
			userToken = splitedToken[1];

			let decoded = jwt.verify(userToken, Config.secret);

			// find company
			Company.findByPk(decoded.foundedUser.id)
				.then((succ) => {
					next();
				},
				(err) => {
					console.log(err);
				});
			
		
		}
		else 
			throw "Missing token Authorization!";
	}
	catch(err){
		res.status(403).json( {errorMessage: err} )
	}
}



module.exports.newPermitValidation = [
	body('fair_id', 'There is no selected FAIR!').exists(),
	body('company_id', 'There is no selected company!').exists(),
	body('package_id', 'There is no selected package!').exists()
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
			company_id: findCompany.id,
			package_id: req.body.package_id
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

		let foundedCompany = await Company.findOne({
			where: { id: req.query.id },
			include: [Job]
		});

		if(!foundedCompany)
			throw "Company not found!";

		res.json(foundedCompany);
	}
	catch(e){
		res.status(403).json({errorMessage: e});
	}
};



/**
 * List of fairs with the pemits and packages and additional packages
 */
module.exports.fairs = async (req, res) => {

	try {

		console.log(req.query.company_id + " : COMPANY ID" );
		let allFairs;
		if(req.query.company_id){
			allFairs = await Fair.findAll(
				{
					include: [
						Package, Additional, Company, 
						{
							model: Permit, where: {
							company_id: req.query.company_id
							},
							required: false,
						}
					]
				}
			);
		}
		// catch all 
		else {
			allFairs = await Fair.findAll(
				{
					include: [
						Package, Additional, Company, Permit
					]
				}
			);
		}
		
		
		res.status(200).json(allFairs);
	}
	catch (e) {
		console.log('FairController::fairs:' + e);
		res.status(403).json({errorMessage: e});
	}
}


module.exports.cancelPermit = async (req, res) => {
	try{
		let findPermit = await Permit.findByPk(req.query.id);
		if(findPermit)
			findPermit.destroy();
		else 
			throw "We have not found your participation!";

		res.json({successMessage: "Successfully deleted you particiaption!"});
	}
	catch(e){
		res.status(403).json({ errorMessage: e});
	}


}

module.exports.findPermitValidation  = [
	check('company_id', 'There is no selected company!').exists(),
];

Permit.belongsTo(Package, { foreignKey: 'package_id'});
Permit.belongsToMany(Additional, { through: 'permit_additionals', foreignKey: 'permit_id', otherKey: 'additional_id' });


/**
 * @return All founded permits for this company
 */
module.exports.findPermits = async (req, res) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}

		let foundedPermits = await Permit.findAll({ 
			where: {
				company_id: req.query.company_id, 
			},
			include: [Package, Additional]
		});

		if(!foundedPermits) throw "There is no founded permit!";

		res.json(foundedPermits);
	}
	catch(e){
		res.status(403).json({ errorMessage : e});
	}
}


module.exports.findOnePermitValidation  = [
	check('id', 'There is no selected company!').exists(),
];
// find permit
module.exports.findPermit = async( req, res ) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}

		let foundedPermit = await Permit.findOne({ 
			where: {
				id: req.query.id
			},
			include: [Package, Additional]
		});

		if(!foundedPermit) throw "There is no founded permit!";

		res.json(foundedPermit);
	}
	catch(e){
		res.status(403).json({ errorMessage : e});
	}
}


/**
 * New Job Or Edit Job
 */
module.exports.newJobValidation = [
	body('name', 'There is no name!').exists().isString(),
	body('text', 'There is no description!').exists().isString(),
	body('start', 'Start date wrong format!').isISO8601(),
	body('end', 'End date wrong format!').isISO8601(),
	body('type', 'There is no type!').exists(),
	check('company_id', 'There is no company').exists(),
];

// if the id is set than edit the job
module.exports.newJob = async (req, res) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}

		let findCompany = await Company.findByPk(req.query.company_id);

		if(!findCompany) throw "We could not find your company in our register!";


		let newOrEditValues = {
			company_id: findCompany.id,
			name: req.body.name,
			text: req.body.text,
			start: req.body.start,
			end: req.body.end,
			type: req.body.type
		};
		let insertJob;
		let newJob = true;
		// edit
		if(req.body.id){
			newJob = false;
			let updateJob = await Job.findByPk(req.body.id);
			if(!updateJob) throw "The job you have specified doesnt exists!";

			updateJob.update(newOrEditValues);
		}
		// create new 
		else 	{
			insertJob = await Job.create(newOrEditValues);
			if(!insertJob) throw "The job is not inserted!";
		}

		let successMessage = 'The job has been inserted!';
		if(!newJob)
			successMessage = 'The job has been changed!';

		res.json({ successMessage: successMessage, newJob: newJob });
	}
	catch(e){
		res.status(403).json({ errorMessage : e});
	}


}

/**
 * Jobs of the company
 */
module.exports.myJobsValidation = [
	check('id', 'Company id is not set')
];

module.exports.myJobs = async (req,res) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}
		let findCompany = await Company.findOne({
			where: {id : req.query.id},
			include: [Job]
		});
		if(!findCompany) throw "Company is not founded!";

		res.json(findCompany.jobs);
	}
	catch(e){
		res.status(401).json({errorMessage: e});
	}
}


/**
 * Removing job
 */
module.exports.removeJobValidation = [
	check('job_id', 'There is no job').exists()
]


module.exports.removeJob = async ( req, res ) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}

		let userToken = req.header('Authorization');
        let splitedToken = userToken.split(' ');
        userToken = splitedToken[1];
		
		
		let foundedJob = await Job.findByPk(req.query.job_id);
		let loggedUser = jwt.verify(userToken, Config.secret);

		if(foundedJob.company_id != loggedUser.foundedUser.id)
			throw "You are not allowed to delete this users job!";
		if(!foundedJob)
			throw "We have not founded your JOB";

		foundedJob.destroy();
		
		res.json({ successMessage: 'You have deleted this job!'});
	}
	catch(e){
		res.status(401).json({errorMessage: e});

	}
}  



module.exports.viewJobValidation = [
	check('id', 'There is no selected job!').exists()
];

module.exports.viewJob = async ( req, res ) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}

		let loggedUser = await LoginController.tokenToUser(req.headers.authorization);
		let viewingJob = await Job.findOne({
			where: { id: req.query.id }
		});

		let applications = await Application.findAll({
			where: {
				job_id: req.query.id
			},
			include: [Student] 
		});

		if(!viewingJob) throw "There is no job under that id!";
		if(viewingJob.company_id != loggedUser.id)
			throw "You are not allowed to view this Job";

		// return job info
		res.json({ 
			job: viewingJob,
			applications: applications
		});
	}
	catch(e){
		res.status(403).json({ errorMessage: e });
	}


} 

/**
 * Updates the accepting application
 */
module.exports.acceptApplicationValidation = [
	check('id', 'There is no application id selected')
]

module.exports.acceptApplication = async (req, res) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array()[0].msg;
		}

		let loggedUser = await LoginController.tokenToUser(req.headers.authorization);
		let acceptingApplication = await Application.findOne({
			where: {id : req.query.id},
			include: [Job]
		});

		if(!loggedUser) throw "There is no logged user!";
		if(!acceptingApplication) throw "There is no selected Application!";

		if(loggedUser.id != acceptingApplication.job.company_id)
			throw "You are not allowed to accept this application!";

		// update accepting application
		acceptingApplication.accepted = new Date();
		acceptingApplication.save();
		
		res.json({
			successMessage: 'You have accepted this application!',
			application: acceptingApplication
		});
	}
	catch(e) {
		res.status(403).json({ errorMessage: e})
	}

}