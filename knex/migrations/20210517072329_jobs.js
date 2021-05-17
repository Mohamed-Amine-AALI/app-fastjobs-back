
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('jobs', function(table) {
        table.increments();
        table.string('Name');
        table.text('Description');
        table.integer('Categories');
        table.dateTime('Date')
        table.string('Remuneration')
        table.string('State')
        table.string('LongLat')
        table.integer('Tasker');
        table.integer('Jobber');
    })
};

exports.down = function(knex) {
  
};
