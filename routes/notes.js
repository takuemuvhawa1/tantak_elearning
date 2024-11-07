const express = require('express');
const notesRouter = express.Router();
const notesDbOperations = require('../cruds/notes');

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
