const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);

exports.get = id => {
    if (!id) {
        return db('projects').then(result => {
            result[0].complete = result[0].complete === 0 ? false : true;
            return result;
        });
    }
};
