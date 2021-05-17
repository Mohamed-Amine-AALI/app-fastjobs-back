
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('longlat', function(table) {
        table.increments();
        table.float('long');
        table.float('lat');
    })
};

exports.down = function(knex) {
  
};
