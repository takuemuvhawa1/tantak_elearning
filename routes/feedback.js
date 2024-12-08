const express = require('express');
const feedbackRouter = express.Router();
const feedbackDbOperations = require('../cruds/feedback');
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

// Create a new feedback
feedbackRouter.post('/', async (req, res) => {
    try {
        const { module_id, student_id, assignment_id, path, marked } = req.body;
        const results = await feedbackDbOperations.postFeedback(module_id, student_id, assignment_id, path, marked);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// feedbackRouter.post('/assignment', upload.single('file'), async (req, res, next) => {
//     try {
//       let postedValues = req.body;

//       // Extracting fields from the request body
//       let module_id = postedValues.module_id || null; 
//       let student_id = postedValues.student_id || null;
//       let assignment_id = postedValues.assignment_id || null;
//       let marked = "F";
//     //   let path = postedValues.file;

//       // Store the uploaded file path in the 'video' field
//       let path = req.file ? `${pool}/download/${req.file.filename}` : null;

//       // Log the values for debugging
//       console.log(req.file);
//       console.log('Values being inserted:', 
//         module_id, student_id, assignment_id, path, marked );

//       // Call the database operation to insert the lesson
//       let results = await feedbackDbOperations.postFeedback(
//         module_id, student_id, assignment_id, path, marked
//       );

//       // Respond with the results
//       res.json(results);
//     } catch (e) {
//       console.error(e);
//       res.sendStatus(500); // Send a generic server error response
//     }
//   });

feedbackRouter.post('/assignment', upload.single('file'), async (req, res, next) => {
    try {
        let postedValues = req.body;

        // Extracting fields from the request body
        let module_id = postedValues.module_id || null;
        let student_id = postedValues.student_id || null;
        let assignment_id = postedValues.assignment_id || null;
        let marked = postedValues.marked || "";

        // Store the uploaded file path in the 'video' field
        let path = req.file ? `${pool}/download/${req.file.filename}` : null;

        // Log the values for debugging
        console.log(req.file);
        console.log('Values being inserted:',
            module_id, student_id, assignment_id, path, marked);

        // Call the database operation to insert the lesson
        let results = await feedbackDbOperations.postFeedback(
            module_id, student_id, assignment_id, path, marked
        );

        // Respond with the results
        res.json(results);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});


// Get all feedback
feedbackRouter.get('/', async (req, res) => {
    try {
        const results = await feedbackDbOperations.getFeedback();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get feedback by ID
feedbackRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await feedbackDbOperations.getFeedbackById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get feedback MARKED by ID
feedbackRouter.get('/marked/:modID/:stuID', async (req, res) => {
    try {
        const modID = req.params.modID;
        const stuID = req.params.stuID;
        const result = await feedbackDbOperations.getFeedbackMarkedById(modID, stuID);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get feedback SUBMITTED by ID
feedbackRouter.get('/submitted/:modID/:stuID', async (req, res) => {
    try {
        const modID = req.params.modID;
        const stuID = req.params.stuID;
        const result = await feedbackDbOperations.getFeedbackSubmittedById(modID, stuID);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get feedback MARKED by ID PER MODULE
feedbackRouter.get('/marked/:modID', async (req, res) => {
    try {
        const modID = req.params.modID;
        const stuID = req.params.stuID;
        const result = await feedbackDbOperations.getFeedbackMarkedByIdPerModule(modID);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get feedback SUBMITTED by ID PER MODULE
feedbackRouter.get('/submitted/:modID', async (req, res) => {
    try {
        const modID = req.params.modID;
        const stuID = req.params.stuID;
        const result = await feedbackDbOperations.getFeedbackSubmittedByIdPerModule(modID);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update feedback by ID
feedbackRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { module_id, student_id, assignment_id, date, path, marked } = req.body;
        const result = await feedbackDbOperations.updateFeedback(id, module_id, student_id, assignment_id, date, path, marked);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete feedback by ID
feedbackRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await feedbackDbOperations.deleteFeedback(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = feedbackRouter;
