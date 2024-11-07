const express = require('express');
const lessonsRouter = express.Router();
const lessonsDbOperations = require('../cruds/lessons');
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

// Create a new lesson
lessonsRouter.post('/', async (req, res) => {
    try {
        const { module_id, lesson_no, topic, objectives, assignment, video, date_posted, release_date } = req.body;
        const results = await lessonsDbOperations.postLesson(module_id, lesson_no, topic, objectives, assignment, video, date_posted, release_date);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

lessonsRouter.post('/lesson', upload.single('file'), async (req, res, next) => {
    try {
      let postedValues = req.body;
  
      // Extracting fields from the request body
      let module_id = postedValues.module_id || null;
      let lesson_no = postedValues.lesson_no || null;
      let topic = postedValues.topic || null;
      let objectives = postedValues.objectives || null;
      let assignment = postedValues.assignment || null;
      
      // Store the uploaded file path in the 'video' field
      let video = req.file ? `${pool}/file/${req.file.filename}` : null;

  
      let release_date = postedValues.release_date || null;
      let expiryDate = postedValues.expiryDate || null;
  
      // Log the values for debugging
      console.log('Values being inserted:', 
        module_id, lesson_no, topic, objectives, assignment, video, release_date );
  
      // Call the database operation to insert the lesson
      let results = await lessonsDbOperations.postLesson(
        module_id, lesson_no, topic, objectives, assignment, video, release_date
      );
  
      // Respond with the results
      res.json(results);
    } catch (e) {
      console.error(e);
      res.sendStatus(500); // Send a generic server error response
    }
  });

// Get all lessons
lessonsRouter.get('/', async (req, res) => {
    try {
        const results = await lessonsDbOperations.getLessons();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get lesson by ID
lessonsRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await lessonsDbOperations.getLessonById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get lesson module by ID
lessonsRouter.get('/mod/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await lessonsDbOperations.getLessonModById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update lesson by ID
lessonsRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { module_id, lesson_no, topic, objectives, assignment, video, date_posted, release_date } = req.body;
        const result = await lessonsDbOperations.updateLesson(id, module_id, lesson_no, topic, objectives, assignment, video, date_posted, release_date);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete lesson by ID
lessonsRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await lessonsDbOperations.deleteLesson(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = lessonsRouter;
