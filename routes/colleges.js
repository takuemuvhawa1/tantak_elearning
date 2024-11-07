const express = require('express');
const collegesRouter = express.Router();
const collegesDbOperations = require('../cruds/colleges');

// Create a new college
collegesRouter.post('/', async (req, res) => {
    try {
        const postedValues = req.body;
        const results = await collegesDbOperations.postCollege(postedValues.name, postedValues.description, postedValues.profile_pic, postedValues.adminId);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all colleges
collegesRouter.get('/', async (req, res) => {
    try {
        const results = await collegesDbOperations.getColleges();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get college by ID
collegesRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collegesDbOperations.getCollegeById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update college by ID
collegesRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedValues = req.body;
        const result = await collegesDbOperations.updateCollege(id, updatedValues.name, updatedValues.description, updatedValues.profile_pic, updatedValues.adminId);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete college by ID
collegesRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collegesDbOperations.deleteCollege(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = collegesRouter;