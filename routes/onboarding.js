const express = require('express');
const onBoardingRouter = express.Router();
const onBoardingDbOperations = require('../cruds/onboarding');
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

const crypto = require('crypto');

const { generateToken, verifyToken } = require('../utilities/jwtUtils');
const authenticateToken = require('../utilities/authenticateToken');

// Create User
onBoardingRouter.post('/', async (req, res) => {
    try {
        const { name, surname, email, phone, password } = req.body;

        // Hash the password using MD5
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        let results = await onBoardingDbOperations.postUser(name, surname, email, phone, hashedPassword);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Create User Admin
onBoardingRouter.post('/teacher', upload.single('file'), async (req, res) => {
    try {
        const { name, surname, email, phone, password, collegeName, collegeDescription } = req.body;

        let path = req.file ? `${pool}/download/${req.file.filename}` : null;

        // Hash the password using MD5
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        let results = await onBoardingDbOperations.postUserAdmin(name, surname, email, phone, hashedPassword, collegeName, collegeDescription, path);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

onBoardingRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        let result = await onBoardingDbOperations.authenticateUser(email, hashedPassword);


        if (!result) {
            return res.status(401).send('Invalid credentials');
        }

         // Generate JWT token
         const token = generateToken(result); 
         console.log('TOKEN: ', token);
         result.token = token;

        //  // Send user data and token in one response

        //  res.status(result.status).json({ result: result, token });

        // res.append("Authorization", `Bearer ${token}`);
        res.status(result.status).json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

onBoardingRouter.post('/resetpassword', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        console.log(req.body);

        // Hash the password using MD5
        const hashedOldPassword = crypto.createHash('md5').update(oldPassword).digest('hex');
        const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

        let result = await onBoardingDbOperations.resetPassword(email, hashedOldPassword, hashedPassword);
        res.status(result.status).json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

onBoardingRouter.post('/forgotpassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Hash the password using MD5
        const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

        let result = await onBoardingDbOperations.forgotPassword(email, hashedPassword);
        res.status(result.status).json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = onBoardingRouter;
