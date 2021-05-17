
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('categorie', function(table) {
        table.increments();
        table.string('Name');
    })
};

exports.down = function(knex) {
  
};
