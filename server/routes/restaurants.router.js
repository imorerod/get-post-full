const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req,res) => {
    // Builds string to use in database later
    // This string will be used to get all data from the
    // restaurants table
    const queryString = `SELECT * FROM restaurants;`;

    // Use the connection from the database (called 'pool')
    // and use the query string above, to get the data
    // out of the database
    pool.query(queryString)
        .then((response) => {
            // If that is successful, go ahead and send all 
            // that data, down to the client side
            res.send(response.rows);
        })
        .catch((err) => {
            // If it was not successful, let us know there
            // was an error
            console.log('Error getting data from database: ', err);
            res.sendStatus(500);
        })
});

router.post('/', (req,res) => {
    // Create a variable that has a name reflective of the name it
    // had on the client side. Set this equal to the req.body,
    // which was provided to us by body-parser
    const restaurantObject = req.body;

    // Setting up the query string used for SQL later to save the 
    // data in. Note the $1,$2,$3 will eventually map to values
    // we enter when we get to the actual query
    const queryString = `INSERT INTO restaurants (name, address, bestfood)
                    VALUES ($1,$2,$3);`;

    // Hey connection to the database, run a query with the
    // string we built above. Mapping the values inside the array
    // in the order they are provided.
    pool.query(queryString, [restaurantObject.name, restaurantObject.address, restaurantObject.bestfood])
        .then((response) => {
            // 201 tells the client that the server was able to
            // save to the database. 'Created' is what the client sees
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('Error saving to DB: ', err);
            res.sendStatus(500);
        });
});

module.exports = router;