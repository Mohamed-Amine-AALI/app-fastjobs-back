const fs = require('fs');
require('dotenv').config();
const knex = require('knex')({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME  }
  })

let columns = new Set();                                            
let jobs = JSON.parse(fs.readFileSync('../startupweek-back/knex/db/jobs.json', 'utf8'));

jobs.forEach(job => {
    Object.keys(job).forEach(key => {
        columns.add(key);
    });
});
knex.schema.dropTableIfExists('jobs').then(function () {
    knex.schema.createTable('jobs',function (table) {
        table.increments()
        columns.forEach(column => {
            table.string(column, 10000)
        })
    }).then (function() {
        return knex("jobs").insert(jobs)
    }).then(function(){
        console.log(' All jobs imported into database ! Closing connection');
        knex.destroy();
    })    
})