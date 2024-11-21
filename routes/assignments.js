const express = require('express');
const assignmentsRouter = express.Router();
const assignmentsDbOperations = require('../cruds/assignments');
const pool = require('../cruds/poolapi');

const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    }
});

const upload = multer({ storage: storage });

// Create a new assignment
assignmentsRouter.post('/', async (req, res) => {
    try {
        const { module_id, type, topic } = req.body;
        console.log(req.body)
        let path = req.file ? `${pool}/download/${req.file.filename}` : null;
        const results = await assignmentsDbOperations.postAssignment(module_id, type, topic, path);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

assignmentsRouter.post('/assignment', upload.single('file'), async (req, res, next) => {
    try {
        let postedValues = req.body;

        // Extracting fields from the request body
        let module_id = postedValues.module_id || null;
        let topic = postedValues.topic || null;
        let type = postedValues.type || null;

        // Store the uploaded file path in the 'video' field
        let path = req.file ? `${pool}/download/${req.file.filename}` : null;

        // Call the database operation to insert the lesson
        let results = await assignmentsDbOperations.postAssignment(
            module_id, type, topic, path
        );

        // Respond with the results
        res.json(results);
    } catch (e) {
        console.error(e);
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
