const knex = require('knex');

const knexFile = require('./knexfile').development;

const db = knex(knexFile);