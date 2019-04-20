var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var Manager = require('./models/manager');
var Vehicle = require('./models/vehicle');
var PaymentMethod = require('./models/paymentMethod');
var ParkingLot = require('./models/parkinglot');
var Own = require('./models/own');
var Pay = require('./models/pay');



// invoke an instance of express application.
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/folder_name'));

// set our application port
//app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
	key: 'user_sid',
	secret: 'somerandonstuffs',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000
	}
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie('user_sid');        
	}
	next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
	if (req.session.user && req.cookies.user_sid) {
		res.redirect('/dashboard');
	} else {
		next();
	}    
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
	res.redirect('/login');
});


// route for user signup
app.route('/signup')
.get(sessionChecker, (req, res) => {
	res.render('signup',{title:"Signup"});
})
.post((req, res) => {
	var type = req.body.type;

	if(type == 'user') {
		User.create({            
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password
		})
		.then(user => {
			req.session.user = user.dataValues;
			res.redirect('/dashboard');
		})
		.catch(error => {
			res.redirect('/signup');
		});
	} else if(type == 'manager') {
		Manager.create({            
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password
		})
		.then(manager => {
			req.session.manager = manager.dataValues;
			res.redirect('/managerSettings');
		})
		.catch(error => {
			res.redirect('/signup');
		});
	}
});


// route for user Login
app.route('/login')
.get(sessionChecker, (req, res) => {
	res.render('login',{title:"Login"});
})
.post((req, res) => {
	var username = req.body.email,
	password = req.body.password,
	type = req.body.type;

	if(type == 'user') {
		User.findOne({ where: { email: username } }).then(function (user) {
			if (!user) {
				res.redirect('/signup');
			} else if (!user.validPassword(password)) {
				res.redirect('/login');
			} else {
				req.session.user = user.dataValues;
				res.redirect('/dashboard');
			}
		});
	} else if(type == 'manager') {
		Manager.findOne({ where: { email: username } }).then(function (manager) {
			if (!manager) {
				res.redirect('/signup');
			} else if (!manager.validPassword(password)) {
				res.redirect('/login');
			} else {
				req.session.manager = manager.dataValues;
				res.redirect('/managerSettings');
			}
		});
	}
});


// route for user's dashboard
app.get('/dashboard', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.render('dashboard',{title:"Dashboard"});
	} else {
		res.redirect('/login');
	}
});


// route for user logout
app.get('/logout', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		res.redirect('/');
	} else {
		res.redirect('/login');
	}
});

// route for Settings
app.route('/settings')
.get((req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		var firstName = req.session.user.firstName;
		var lastName = req.session.user.lastName;
		var make = [];
		var model = [];
		var color = [];
		var plateNumber = [];
		var cardNumber = [];

		Own.hasMany(Vehicle, {foreignKey: 'id', sourceKey: "vehicleID"})
		Vehicle.belongsTo(Own, {foreignKey: 'id', sourceKey: 'vehicleID'})
		Pay.hasMany(PaymentMethod, {foreignKey: 'id', sourceKey: "paymentID"})
		PaymentMethod.belongsTo(Pay, {foreignKey: 'id', sourceKey: 'paymentID'})
		Own.findAll({
			where: {userID: req.session.user.id},
			include: [{
				model: Vehicle,
				required: true
			}],
			raw: true
		}).then(vehicles => {
			if(vehicles !== null) {
 			 	// console.log(Object.keys(vehicles[0]))	// id of second vehicle
 			 	// console.log(Object.keys(vehicles).length) // number of vehicles
 			 	var i;
 			 	for(i=0; i<Object.keys(vehicles).length; i++) {
 			 		make.push(vehicles[i]['vehicles.make'])
 			 		model.push(vehicles[i]['vehicles.model'])
 			 		color.push(vehicles[i]['vehicles.color'])
 			 		plateNumber.push(vehicles[i]['vehicles.plateNumber'])

 			 		Pay.findAll({
 			 			where: {userID: req.session.user.id},
 			 			include: [{
 			 				model: PaymentMethod,
 			 				required: true
 			 			}],
 			 			raw: true
 			 		}).then(cards => {
 			 			if(cards !== null) {
 			 				var i;
 			 				for(i=0; i<Object.keys(cards).length; i++) {
 			 					cardNumber.push(cards[i]['paymentMethods.cardNumber'].slice(-4))
 			 				}
 			 			}
 			 			res.render('settings',{title:"Settings", firstName:firstName, lastName:lastName,
 			 				make: make, model: model, color: color, plateNumber: plateNumber, cardNumber: cardNumber})
 			 		});
 			 	}
 			 }

 			});

	} else {
		res.redirect('/login');
	};
	console.log("shrodo");



}).post((req, res) => {
	var firstName =req.body.firstName;
	var lastName = req.body.lastName;

	User.update(
	{

		firstName: firstName,
		lastName: lastName

	},
	{ where: { id: req.session.user.id } }
	)
	.then(result =>
		req.session.user.firstName = firstName
		)
	.error(err =>
		handleError(err)
		)
	res.redirect('/settings');
});

// route for addVehicle
app.route('/addVehicle')
.get((req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.render('addVehicle',{title:"Manager Settings"});
	} else {
		res.redirect('/login');
	}
}).post((req, res) => {
	Vehicle.create({            
		plateNumber: req.body.plateNumber,
		make: req.body.make,
		model: req.body.model,
		color: req.body.color,
		state: req.body.state
	})
	.then(vehicle => {
		Own.update(
			{ active: false },
			{ where: { userID: req.session.user.id } }
			).then( owns => {
				Own.create({
					userID: req.session.user.id,
					vehicleID: vehicle.id,
					active: true
				})
				res.redirect('/settings');
			}).error(err =>
			handleError(err)
			)
		})
	.catch(error => {
		res.redirect('/signup');
	});

});

// route for addPayment
app.route('/addPayment')
.get((req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.render('addPayment',{title:"Manager Settings"});
	} else {
		res.redirect('/login');
	}
}).post((req, res) => {
	console.log(req.body.cardNumber)
	console.log(req.body.cvv)
	console.log(req.body.expirationMonth)
	console.log(req.body.expirationYear)
	PaymentMethod.create({            
		cardNumber: req.body.cardNumber,
		cvv: req.body.cvv,
		expirationMonth: req.body.expirationMonth,
		expirationYear: req.body.expirationYear
	})
	.then(paymentMethod => {
		Pay.update(
			{ active: false },
			{ where: { userID: req.session.user.id } }
			).then( pays => {
				Pay.create({
					userID: req.session.user.id,
					paymentID: paymentMethod.id,
					active: true
				})
				res.redirect('/settings');
			}).error(err =>
			handleError(err)
			)
		})
	.catch(error => {
		res.redirect('/signup');
	});
	
});




// route for managerSettings
app.get('/managerSettings', (req, res) => {
	if (req.session.manager && req.cookies.user_sid) {
		res.render('managerSettings',{title:"Manager Settings"});
	} else {
		res.redirect('/login');
	}
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
	res.status(404).send("Sorry can't find that!")
});

module.exports = app;