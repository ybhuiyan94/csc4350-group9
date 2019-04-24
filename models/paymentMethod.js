var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://Group9:Akshita1234@aagn29ugs86czq.c31f2v7z8hc6.us-west-2.rds.amazonaws.com:5432/postgres');

// setup PaymentMethod model and its fields.
var PaymentMethod = sequelize.define('paymentMethod', {
    cardNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    cvv: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expirationMonth: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expirationYear: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
// sequelize.sync()
//     .then(() => console.log('paymentMethods table has been successfully created, if one doesn\'t exist'))
//     .catch(error => console.log('This error occured', error));

// export Vehicle model for use in other files.
module.exports = PaymentMethod;