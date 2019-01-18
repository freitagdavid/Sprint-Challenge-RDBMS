const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const port = 5000;
const server = express();
server.use(express.json());
const db = knex(knexConfig.development);
const { projects } = require('./db/db');

server.get('/', ({ res }) => {
    res.status(200).json({ success: 'All is well' });
});

// COMPLETE GET /api/projects
server.get('/api/projects', (req, res) => {
    projects.get().then(result => res.status(200).json(result));
});

// COMPLETE POST /api/projects
server.post('/api/projects', (req, res) => {
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

// TODO PUT /api/projects
// TODO DELETE /api/projects

server.post('/api/projects/:project_id/actions', (req, res) => {
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

server.get('/api/projects/:id', (req, res) => {
    const project_id = req.params.id;
    db('projects')
        .where({ id: project_id })
        .then(projects_result => {
            db('actions')
                .where({ project_id: project_id })
                .then(actions_result => {
                    let results = projects_result;
                    // console.log(actions_result);
                    results[0].actions = actions_result;
                    results[0].complete =
                        results[0].complete === 0 ? false : true;
                    results[0].actions = results[0].actions.map(action => {
                        action.complete = action.complete === 0 ? false : true;
                        return action;
                    });
                    res.status(200).json({ results });
                });
        })
        .catch(err => {
            console.log(err);
        });
});

server.listen(port, () => console.log('Server is listening on port', port));
