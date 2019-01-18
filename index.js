const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const port = 5000;
const server = express();
server.use(express.json());
const db = knex(knexConfig.development);

server.get('/', ({ res }) => {
    res.status(200).json({ success: 'All is well' });
});

server.post('/projects', (req, res) => {
    const data = req.body;
    db('projects')
        .insert(data)
        .then(result => {
            res.status(200).json({ result });
        })
        .catch(err => {
            if (err.errno === 19) {
                res.status(400).json({ errMessage: 'Name is required' });
            } else {
                res.status(500).json(err);
            }
        });
});

server.post('/projects/:project_id/actions', (req, res) => {
    const { project_id } = req.params;
    const data = req.body;
    data['project_id'] = project_id;

    db('projects')
        .where({ id: project_id })
        .then(result => {
            if (result.length === 0) {
                res.status(404).json({
                    errMessage: 'Project by this id does not exist',
                });
            } else {
                db('actions')
                    .insert(data)
                    .then(result => {
                        res.status(200).json({ result });
                    })
                    .catch(err => {
                        if (err.errno === 19) {
                            res.status(400).json({
                                errMessage: 'description is required',
                            });
                        }
                    });
            }
        });
});

server.listen(port, () => console.log('Server is listening on port', port));
