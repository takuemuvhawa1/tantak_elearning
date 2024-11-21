const express = require('express');
const modulesRouter = express.Router();
const modulesDbOperations = require('../cruds/modules');
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

modulesRouter.post('/module', upload.single('file'), async (req, res, next) => {
    try {
      let postedValues = req.body;
  
      // Extracting fields from the request body
      let course_id = postedValues.course_id || null;
      let name = postedValues.name || null;
      let description = postedValues.description || null;
      let instructor = postedValues.instructor || null;
      
      // Store the uploaded file path in the 'video' field
      let profile_pic = req.file ? `${pool}/file/${req.file.filename}` : null;
  
      // Call the database operation to insert the lesson
      let results = await modulesDbOperations.postModule(
        course_id, name, description, instructor, profile_pic
      );
  
      // Respond with the results
      res.json(results);
    } catch (e) {
      console.error(e);
      res.sendStatus(500); // Send a generic server error response
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
