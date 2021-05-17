
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('facture', function(table) {
        table.increments();
        table.string('NumFacture');
        table.dateTime('Date')
        table.text('Description');
        table.integer('IdJob');
        table.integer('Tasker');
        table.integer('Jobber');
    })
};

exports.down = function(knex) {
  
};
