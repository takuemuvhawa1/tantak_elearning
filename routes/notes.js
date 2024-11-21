const express = require('express');
const notesRouter = express.Router();
const notesDbOperations = require('../cruds/notes');
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

// Create a new note
notesRouter.post('/', async (req, res) => {
    try {
        const { module_id, title, author } = req.body;
        const results = await notesDbOperations.postNote(module_id, title, author);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

notesRouter.post('/note', upload.single('file'), async (req, res, next) => {
    try {
        let postedValues = req.body;

        // Extracting fields from the request body
        let module_id = postedValues.module_id || null;
        let title = postedValues.title || null;
        let author = postedValues.author || null;

        // Store the uploaded file path in the 'video' field
        let path = req.file ? `${pool}/download/${req.file.filename}` : null;

        // Call the database operation to insert the lesson
        let results = await notesDbOperations.postNote(
            module_id, title, author, path
        );

        // Respond with the results
        res.json(results);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

// Get all notes
notesRouter.get('/', async (req, res) => {
    try {
        const results = await notesDbOperations.getNotes();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get note by ID
notesRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await notesDbOperations.getNoteById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get note by module ID
notesRouter.get('/mod/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await notesDbOperations.getNoteModById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update note by ID
notesRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { module_id, title, author } = req.body;
        const result = await notesDbOperations.updateNote(id, module_id, title, author);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete note by ID
notesRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await notesDbOperations.deleteNote(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = notesRouter;
