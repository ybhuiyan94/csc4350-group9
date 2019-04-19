var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://Group9:Akshita1234@aagn29ugs86czq.c31f2v7z8hc6.us-west-2.rds.amazonaws.com:5432/postgres');

// setup User model and its fields.
var Pay = sequelize.define('pay', {
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    paymentID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
// sequelize.sync()
//     .then(() => console.log('pays table has been successfully created, if one doesn\'t exist'))
//     .catch(error => console.log('This error occured', error));

// export Vehicle model for use in other files.
module.exports = Pay;