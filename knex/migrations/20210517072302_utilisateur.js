
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('utilisateur', function(table) {
        table.increments();
        table.string('Lastname');
        table.string('Firstname');
        table.string('Email');
        table.string('Password')
        table.string('Phone')
        table.string('Adress')
        table.string('StripeID')
    })
};

exports.down = function(knex) {
  
};
