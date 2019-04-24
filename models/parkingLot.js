var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://Group9:Akshita1234@aagn29ugs86czq.c31f2v7z8hc6.us-west-2.rds.amazonaws.com:5432/postgres');

// setup ParkingLot model and its fields.
var ParkingLot = sequelize.define('parkingLot', {
    address: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    totalSpaces: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    timeLimit: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    hourlyRate: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
// sequelize.sync()
//     .then(() => console.log('parkingLots table has been successfully created, if one doesn\'t exist'))
//     .catch(error => console.log('This error occured', error));

// export Vehicle model for use in other files.
module.exports = ParkingLot;