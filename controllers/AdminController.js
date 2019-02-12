const Sequelize = require('sequelize');
const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const { check, validationResult, body } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');


const Config = require('../config.json');
const fairs = require('../models/fairs.js');
const packages  = require('../models/packages.js')
const additionals  = require('../models/additionals.js');
const items  = require('../models/items.js');
const locations  = require('../models/locations.js');
const permits  = require('../models/permits.js');
const companies = require('../models/companies.js');
const permitAdditionals = require('../models/permit_additionals.js');

const sequelize = new Sequelize(Config.db, Config.username, Config.password, {dialect: Config.dialect});

const Fair = new fairs(sequelize, Sequelize);
const Additional = new additionals(sequelize, Sequelize);
const Item = new items(sequelize, Sequelize);
const Package = new packages(sequelize, Sequelize);
const Locat = new locations(sequelize, Sequelize);
const Permit = new permits(sequelize, Sequelize);
const Company = new companies(sequelize, Sequelize);
const Location = new locations(sequelize, Sequelize);
const PermitAdditional = new permitAdditionals(sequelize, Sequelize);


//Fair.hasMany(Permit, {foreignKey: 'fair_id', sourceKey: 'id'});
Permit.belongsTo(Company, { foreignKey: 'company_id'});
Permit.belongsTo(Package, { foreignKey: 'package_id'});
Fair.belongsToMany(Company, { through: Permit, foreignKey: 'fair_id', otherKey: 'company_id' });
Permit.belongsToMany(Additional, { through: PermitAdditional, foreignKey: 'permit_id', otherKey: 'additional_id'});
Permit.belongsTo(Location, { foreignKey: 'location_id'});
/**
 * Validation rules for inserting new fair
 */
module.exports.newfairValidation = [
	check('fair.name', 'Name of the fair doesnt exist').exists(),
	check('fair.start', 'Start date is not valid').exists().isISO8601(),
	check('fair.end', 'End date is not valid').exists().isISO8601(),
	check('fair.place', 'Place is not valid').exists(),
	check('fair.about', 'About value is not valid').exists(),
	// check('startCV', 'Start CV date is invalid').isISO8601().isEmpty(),
	// check('endCV', 'End CV date is invalid').isISO8601().isEmpty(),
	// check('startParticipate', 'Start Participate date is invalid').isISO8601().isEmpty(),
	// check('endParticipate', 'End Participate CV date is invalid').isISO8601().isEmpty(),
];


module.exports.newFairFilter = [

];

/**
 * New Fair has been created on post request
 */
module.exports.newfair = async function(req, res){
	const errors = validationResult(req);


	if (!errors.isEmpty()) {
	  return res.status(422).json({ errors: errors.array() });
	}

	// sanitize values 
	if(req.body.fair.startCV === "")
		req.body.fair.startCV = null;

	if(req.body.fair.endCV === "")
		req.body.fair.endCV = null;

		
	if(req.body.fair.startParticipate === "")
		req.body.fair.startParticipate = null;

	
	if(req.body.fair.endParticipate === "")
		req.body.fair.endParticipate = null;

	try{
		let creatingFair = req.body.fair;

		let startDate = new Date(creatingFair.start);
		let endDate = new Date(creatingFair.end);
		// date check
		if(startDate >= endDate)
			throw "Ending time is before start time!";

		// return error if the latest fair has not ended
		let latestFair = await Fair.findOne({
			where: { end: { $gt: new Date().toISOString() } }
		});
		
		if(latestFair){
			throw "The latest fair is still going!";
		}

		else{ // Create fair if there is no fairs that are still going
			let newFair = await Fair.create(creatingFair);

			// create locations
			let locations = req.body.locations;
			for(let loc of locations){
				Location.create(
					{
						fair_id: newFair.id,
						name: loc
					}
				);
			}

			if(newFair)
				res.status(200).json({
					newInsertedFair: newFair,  
					successMessage: 'The Fair has been created!'
				});
			else 
				res.status(403).json({errorMessage: 'The Fairs has not been inserted'});
		}
	
	}
	catch(err){
		res.status(403).json({ errorMessage: err});
	}	
}

/**
 * Getting image from the folder
 */
module.exports.getImage = (req, res, next) => {
	let imageName = req.query.name;
	console.log('Searching for image: ' + imageName);
	try{
		var options = {
			root: __dirname + '/../images/',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		  };

		  if(!fs.existsSync('./images/' + imageName))
		  	throw "Image not founded";

		res.status(200).sendFile(imageName, options, (err) => {
			if(err)
				next(err);
			else 
				console.log('It\'s with the file!'); 
			// if(err)
			// 	next(err)
			// 	else 
			// throw err;
		});
	}
	catch(err){
		res.status(404).json({
			errorMessage: 'There is no image under that name!' + err
		})
	}
}

/**
 * Validation rules for inserting new packages
 */
module.exports.newpackagesValidation = [
	check('fair_id').exists()
];

module.exports.newpackages = async function(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(422).json({ errors: errors.array() });
	}


	try{
		let currentFair;

		await Fair.findOne({
			where: { id: req.query.fair_id }
		})
		.then(
			(response) => {
				if(response){
					currentFair = response;
				}	
				else throw "There is no Fair under that id";
			}
		);

		
		// fair is set 
		let packages = req.body.Packages;
		let additionals = req.body.Additional;

		// for each package
		for(let currentPackage of packages){
			let maxCompanies = currentPackage.MaxCompanies;
			
			if(currentPackage.MaxCompanies == '-')
				maxCompanies = -1;

			// Insert package
			await Package.create(
				{
					title: currentPackage.Title,
					video_promotion: currentPackage.VideoPromotion,
					no_lessons: currentPackage.NoLessons,
					no_presentation: currentPackage.NoPresentation,
					no_workchops: currentPackage.NoWorkchops,
					price: currentPackage.Price,
					max_companies: maxCompanies,
					fair_id: req.query.fair_id
				}
			).then(
				(createdPackage) => {
					// create items of the package
					let itemsOfPackage = currentPackage.Content;

					for(let currentItem of itemsOfPackage){
						Item.create(
							{
								package_id: createdPackage.id, 
								title: currentItem
							}
						);
					}

				}
			).catch(function(err){
				throw err;
			});

		}


		// for each additional item 
		for(let currentAdditional of additionals){
			await Additional.create({
				title: currentAdditional.Title,
				price: currentAdditional.Price,
				fair_id: req.query.fair_id
			})
			.catch(err => {
				throw err;
			});
		}

		

		res.json({ successMessage: 'The packages has been imported!'});


	}
	catch(err){
		console.log('Importing packages errror:' + err);
		return res.status(403).json({ errorMessage: err });
	}
}


/**
 * Import fairs JSON 
 */
module.exports.importFairs = async function(req, res){
	let importedFairs = req.body.Fairs;
	let importedLocations = req.body.Locations;

	try{
		// import fairs 
		for(let importingFair of importedFairs){

			await Fair.create({
				name: importingFair.Fair,
				start: Date.parse( importingFair.StartDate + ' ' + importingFair.StartTime),
				end: Date.parse(importingFair.EndDate + ' ' + importingFair.EndTime),
				place: importingFair.Place,
				about: importingFair.About
			})
			.then(
				(insertedFair) => {
					if(insertedFair){
						// find locations for this fair 
						let locationsOfFair = importedLocations.find(f => f.Place == insertedFair.place);
						
						// for each place of location of fair
						for(let importingLocation of locationsOfFair.Location){
							// insert location
							Locat.create({
								name: importingLocation.Name,
								fair_id: insertedFair.id
							})
							.then(
								(success) => 
								{
									console.log('Place imported')
								}, 
								(error) => {
									console.log('Place not imported');
									throw error;
								}
							);
						}
						
					}

				},
				(error) => {
					throw error;
				}
			)
			.catch((err) => { 
				console.log('Promise rejected:' + err);
			});
		}
		
		

		return res.json({ success: 'The fairs has been imported!'});

	}
	catch(err){
		return res.status(422).json({ errorMessage: err });
	}

}

/**
 * 	Upload Image of fair
 * 	@return { imageName: $path }
 */
module.exports.uploadImage = function(req, res){
	let returnedFile;
	let form = new IncomingForm();
	let everythingOk = true;

	// when the file is received
	form.on('file', (field, file) => {
		let allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

		// if the type of the file is not allowed
		if(allowedTypes.indexOf(file.type) == -1){
			console.log('Type is not allowed: ' + file.type + '!');
			
			// remove file from the temp
			fs.unlinkSync(file.path);
			everythingOk = false;
		}
		// file is allowed type
		else {
			// move from TMP folder to this folder
			fs.renameSync(file.path, './images/' + file.name, (err) => {
				res.status(403).json({errorMessage: 'File didnt upload!'});
				console.log(err);
			})

			returnedFile = file.name;
			console.log('File uploaded' + returnedFile);
		}
	
	});

	form.on('error', function(err) {
		res.status(403).json({errorMessage: `Didn't received the files: ${err}` });
	});

	form.on('end', () => {
		if(everythingOk)
			res.status(200).json({imageName: returnedFile, successMessage: 'Uspesno ste dodali fajl!'});
		else 
			res.status(403).json({errorMessage: 'Nedozvoljena ekstenzija!'});

	});

	form.parse(req);
} 

/**
 * GET request for new location
 */
module.exports.newLocationValidation = [
	check('fair_id', 'There is no selected fair!').exists(),
	check('name', 'There is no location').exists()
];

module.exports.newLocation = async (req, res) => {
	try{
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			throw errors.array()[0].msg;
		}

		let fairOfLocation = Fair.findByPk(req.query.fair_id);

		if(!fairOfLocation) throw "There is no fair under this id!";

		// check if there is lookalike Location
		let sameLocation = await Location.findOne({ 
			where:
			{
				name: req.query.name,
				fair_id: req.query.fair_id
			}
		});
		if(sameLocation) throw "There is already location under that name!";

		// insert location
		let insertedLocation = await Location.create({
			name: req.query.name,
			fair_id: req.query.fair_id
		});

		if(!insertedLocation) throw "The locations has not been inserted!";

		res.json({successMessage: "The locations has been inserted!", location: insertedLocation});
	}
	catch(e){
		console.log(e);
		res.status(403).json({ errorMessage: e});
	}


}

/**
 * GET request for allowing company permits
 */
module.exports.allowPermitValidation = [
	check('id', 'There is no selected Permit!').exists(),
	check('location_id', 'The locations is not set').exists()
];
module.exports.allowPermit = async (req, res) => {
	try{
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			throw errors.array()[0].msg;
		}

		let changingPermit = await Permit.findByPk(req.query.id);
		
		if(!changingPermit)
			throw "There is no Permit under that id";

		let packgeOfPermit = await Package.findOne({ where: { id:  changingPermit.package_id }});

		if(!packgeOfPermit || packgeOfPermit.max_companies == 0 ) throw "There is fulfiled capacity of this package!";
		
		// decrease number of companies
		if(packgeOfPermit > 0){
			packageOfPermit.max_companies--;
			packageOfPermit.save();
		}		

		let locationOfThePermit = await Location.findByPk(req.query.location_id);
		if(!locationOfThePermit) throw "There is no location founded."

		changingPermit.location_id = locationOfThePermit.id;
		changingPermit.allowed = 1;
		changingPermit.save();

		res.json({
			successMessage: 'Allowing permit is successfull!'
		});
	}	
	catch(e){
		console.log(e);
		res.status(403).json({
			errorMessage: e
		});
	}
}

module.exports.forbidPermitValidation = [
	check('id', 'The permit is not set!').exists(),
];

module.exports.forbidPermit = async (req, res) => {
	try{
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			throw errors.array()[0].msg;
		}

		let changingPermit = await Permit.findByPk(req.query.id);

		if(!changingPermit)
			throw "There is no Permit under that id";
			
		changingPermit.allowed = 0; // forbid permit
		changingPermit.location_id = null;
		changingPermit.save();

		res.json({
			successMessage: 'Forbiding permit is successfull!'
		});
	}	
	catch(e){
		res.status(403).json({
			errorMessage: e
		});
	}
}



module.exports.permitsValidation = [
	check('fair_id', 'Fair id doesnt exists').exists(),
];

/**
 * Returns the list of the permits with the companies
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.permitsOfFair = async (req, res) => {
	try{
		// check for errors
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			throw errors.array()[0].msg;
		}

		let permitsOfFair = await Permit.findAll({
			where: { fair_id: req.query.fair_id },
			include: [Company, Additional, Package, Location]
		});

		res.json(permitsOfFair);
	}
	catch (e) {
		res.status(403).json({errorMessage: e});
	}

}


module.exports.editFairValidation = [
	body('id', 'The fair is not set!').exists(),
	body('start', 'Start date is not valid').exists().isISO8601(),
	body('end', 'End date is not valid').exists().isISO8601(),
	body('startCV', 'Start CV date is invalid').optional({checkFalsy: true}).isISO8601(),
	body('endCV', 'End CV date is invalid').optional({checkFalsy: true}).isISO8601(),
	body('startParticipate', 'Start Participate date is invalid').optional({checkFalsy: true}).isISO8601(),
	body('endParticipate', 'End Participate CV date is invalid').optional({checkFalsy: true}).isISO8601(),
]

module.exports.editFair = async (req, res) => {
	try{
		// check for errors
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			throw errors.array()[0].msg;
		}

		let findFair = await Fair.findByPk(req.body.id);
		if(!findFair) throw "We have not founded your fair!";

		// from body to the db
		findFair.update(req.body);

		res.json({ successMessage: "The Fair has been changed!"});
	}
	catch (e) {
		res.status(403).json({errorMessage: e});
	}

}