const fs = require('fs');
require('dotenv').config();
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    }
})

const jobs = JSON.parse(fs.readFileSync('./knex/db/jobs.json', 'utf8'));
const columns = JSON.parse(fs.readFileSync('./knex/db/jobsColumns.json', 'utf8'));

knex.schema.dropTableIfExists('jobs').then(function () {
    knex.schema.createTable('jobs', function (table) {
        table.increments()
        columns.forEach(columnObject => {
            table[columnObject.columnType](columnObject.columnName);
        });
    }).then(function () {
        return knex("jobs").insert(jobs)
    }).then(function () {
        console.log(' All jobs imported into database ! Closing connection');
        knex.destroy();
    })
})