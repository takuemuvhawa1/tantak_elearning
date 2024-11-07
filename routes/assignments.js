const express = require('express');
const assignmentsRouter = express.Router();
const assignmentsDbOperations = require('../cruds/assignments');

// Create a new assignment
assignmentsRouter.post('/', async (req, res) => {
    try {
        const { module_id, type, topic, description } = req.body;
        const results = await assignmentsDbOperations.postAssignment(module_id, type, topic, description);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all assignments
assignmentsRouter.get('/', async (req, res) => {
    try {
        const results = await assignmentsDbOperations.getAssignments();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get assignment by ID
assignmentsRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await assignmentsDbOperations.getAssignmentById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get assignment module by ID
assignmentsRouter.get('/mod/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await assignmentsDbOperations.getAssignmentModById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update assignment by ID
assignmentsRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { module_id, type, topic, description } = req.body;
        const result = await assignmentsDbOperations.updateAssignment(id, module_id, type, topic, description);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete assignment by ID
assignmentsRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await assignmentsDbOperations.deleteAssignment(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = assignmentsRouter;
