exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('projects')
        .truncate()
        .then(function() {
            // Inserts seed entries
            return knex('projects').insert([{ name: 'Project 1' }]);
        });
};
