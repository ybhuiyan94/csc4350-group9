var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://Group9:Akshita1234@aagn29ugs86czq.c31f2v7z8hc6.us-west-2.rds.amazonaws.com:5432/postgres');

// setup Vehicle model and its fields.
var Vehicle = sequelize.define('vehicle', {
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    plateNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    make: {
        type: Sequelize.STRING,
        allowNull: false
    },
    model: {
        type: Sequelize.STRING,
        allowNull: false
    },
    color: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
// sequelize.sync()
//     .then(() => console.log('vehicles table has been successfully created, if one doesn\'t exist'))
//     .catch(error => console.log('This error occured', error));

// export Vehicle model for use in other files.
module.exports = Vehicle;