const fs = require('fs');
require('dotenv').config();
// Connection to the database using knex
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
})

let columns = new Set();

let users = JSON.parse(fs.readFileSync('../startupweek-back/knex/db/users.json', 'utf8'));

users.forEach(user => {
    Object.keys(user).forEach(key => {
        columns.add(key);                                           // new column added to our list of columns
    });
});

knex.schema.dropTableIfExists('users').then(function () {
    knex.schema.createTable('users', function (table) {
        table.increments()
        columns.forEach(column => {
            table.string(column, 10000)
        })
    }).then(function () {
        return knex("users").insert(users)
    }).then(function () {
        console.log(' All users imported into database ! Closing connection');
        knex.destroy();
    })
})

