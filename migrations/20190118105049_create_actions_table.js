exports.up = function(knex, Promise) {
    return knex.schema.createTable('actions', table => {
        table.increments();
        table.string('name').notNullable();
        table.text('notes');
        table.boolean('complete').defaultTo(false);
        table
            .integer('project_id')
            .unsigned()
            .references('id')
            .inTable('projects');
    });
};

exports.down = function(knex, Promise) {
    return knes.schema.dropTableIfExists('projects');
};
