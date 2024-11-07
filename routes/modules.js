const express = require('express');
const modulesRouter = express.Router();
const modulesDbOperations = require('../cruds/modules');

// Create a new module
modulesRouter.post('/', async (req, res) => {
    try {
        const { course_id, name, description, instructor, profile_pic } = req.body;
        const results = await modulesDbOperations.postModule(course_id, name, description, instructor, profile_pic);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all modules
modulesRouter.get('/', async (req, res) => {
    try {
        const results = await modulesDbOperations.getModules();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get module by ID
modulesRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await modulesDbOperations.getModuleById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get module by course ID
modulesRouter.get('/course/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await modulesDbOperations.getModuleByCourseId(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update module by ID
modulesRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { course_id, name, description, instructor, profile_pic } = req.body;
        const result = await modulesDbOperations.updateModule(id, course_id, name, description, instructor, profile_pic);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete module by ID
modulesRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await modulesDbOperations.deleteModule(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = modulesRouter;
