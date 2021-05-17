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
let invoices = JSON.parse(fs.readFileSync('../startupweek-back/knex/db/invoices.json', 'utf8'));

invoices.forEach(invoice => {
    Object.keys(invoice).forEach(key => {
        columns.add(key);                                           // new column added to our list of columns
    });
});
knex.schema.dropTableIfExists('invoices').then(function () {
    knex.schema.createTable('invoices',function (table) {
        table.increments()
        columns.forEach(column => {
            table.string(column, 10000)
        })
    }).then (function() {
        return knex("invoices").insert(invoices)
    }).then(function(){
        console.log(' All invoices imported into database ! Closing connection');
        knex.destroy();
    })    
})
