const fs = require('fs');
require('dotenv').config();
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: "ec2-79-125-30-28.eu-west-1.compute.amazonaws.com",
        user: "xpgushjfjwzypv",
        password: "339d673052bc436fe62a3d2f301a66c66a7971a31b0d37967a886aef3c8d70b4",
        database: "d9q6od77chsgde",
        port: '5432',
        ssl: { rejectUnauthorized: false }
    }
})

const jobs = JSON.parse(fs.readFileSync('./knex/db/jobs.json', 'utf8'));
const columns = JSON.parse(fs.readFileSync('./knex/db/jobsColumns.json', 'utf8'));
console.log(columns)
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