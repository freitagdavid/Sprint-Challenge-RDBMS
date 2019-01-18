exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('actions')
        .truncate()
        .then(function() {
            // Inserts seed entries
            return knex('actions').insert([
                { description: 'action 1', project_id: 1 },
            ]);
        });
};
