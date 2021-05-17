const fs = require('fs');
require('dotenv').config();
module.exports={
  
    development: {
        client: 'pg',
        connection: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          charset: 'utf8'
        },
        debug:true,
        migrations: {
          directory: __dirname + '/knex/migrations',
        },
        seeds: {
          directory: __dirname + '/knex/seeds'
        }
      }
}