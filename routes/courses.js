const express = require('express');
const coursesRouter = express.Router();
const coursesDbOperations = require('../cruds/courses');

// Create a new course
coursesRouter.post('/', async (req, res) => {
    try {
        const { college_id, name, description, instructor, profile_pic } = req.body;
        const results = await coursesDbOperations.postCourse(college_id, name, description, instructor, profile_pic);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all courses
coursesRouter.get('/', async (req, res) => {
    try {
        const results = await coursesDbOperations.getCourses();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get course by ID
coursesRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await coursesDbOperations.getCourseById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get course by college ID
coursesRouter.get('/college/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await coursesDbOperations.getCourseByCollegeId(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update course by ID
coursesRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { college_id, name, description, instructor, profile_pic } = req.body;
        const result = await coursesDbOperations.updateCourse(id, college_id, name, description, instructor, profile_pic);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete course by ID
coursesRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await coursesDbOperations.deleteCourse(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = coursesRouter;
