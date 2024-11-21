const express = require('express');
const coursesRouter = express.Router();
const coursesDbOperations = require('../cruds/courses');
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

coursesRouter.post('/course', upload.single('file'), async (req, res, next) => {
    try {
      let postedValues = req.body;
  
      // Extracting fields from the request body
      let college_id = postedValues.college_id || null;
      let name = postedValues.name || null;
      let description = postedValues.description || null;
      let instructor = postedValues.instructor || null;
      
      // Store the uploaded file path in the 'video' field
      let profile_pic = req.file ? `${pool}/file/${req.file.filename}` : null;
  
      // Call the database operation to insert the lesson
      let results = await coursesDbOperations.postCourse(
        college_id, name, description, instructor, profile_pic
      );
  
      // Respond with the results
      res.json(results);
    } catch (e) {
      console.error(e);
      res.sendStatus(500); // Send a generic server error response
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
