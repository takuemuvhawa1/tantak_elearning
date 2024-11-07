const express = require('express');
require('dotenv').config();
const cors = require('cors');
const https = require('https');

// const membersDbOperations = require('./cruds/member'); 

// Auth
const authenticateToken = require('./utilities/authenticateToken');

const pool = require('./cruds/poolapi');

const multer = require('multer');
const axios = require('axios');

const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');

const path = require('path');
const fs = require('fs');

// Route path
const userRouter = require('./routes/onboarding');
const mailerRouter = require('./routes/mailer');
const onBoardingRouter = require('./routes/onboarding');
const collegesRouter = require('./routes/colleges');
const coursesRouter = require('./routes/courses');
const modulesRouter = require('./routes/modules');
const lessonsRouter = require('./routes/lessons');
const subscriptionsRouter = require('./routes/subscriptions');
const assignmentsRouter = require('./routes/assignments');
const notesRouter = require('./routes/notes');
const resultsRouter = require('./routes/results');
const feedbackRouter = require('./routes/feedback');

const app = express();
app.use(express.json());
app.use(cors());

//App Route Usage
app.use('/users', userRouter);
app.use('/mailer', mailerRouter);
app.use('/onboarding', onBoardingRouter);
app.use('/colleges', collegesRouter);
app.use('/courses', coursesRouter);
app.use('/modules', modulesRouter);
app.use('/lessons', lessonsRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/assignments', assignmentsRouter);
app.use('/notes', notesRouter);
app.use('/results', resultsRouter);
app.use('/feedback', feedbackRouter);

//FILE UPLOADS
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = function (req, file, cb) {
  cb(null, true); // Allow all file types
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFilename = req.file.filename;
  console.log('File uploaded:', uploadedFilename);

  res.status(200).send(`File uploaded successfully. Filename: ${uploadedFilename}`);
});

// //Upload profile pic
// app.post('/upload/:id', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//   }

//   const uploadedFilename = req.file.filename;
//   console.log('File uploaded:', uploadedFilename);

//   try {
//       const id = req.params.id;
//       const updatedValues = { ProfilePicture: `${pool}/file/`+ uploadedFilename }; 
//       // console.log("id: ", id);
//       // console.log("ProfilePicture: ", uploadedFilename);
//       const result = await membersDbOperations.updateMemberProfilePic(id, updatedValues.ProfilePicture);

//       res.status(200).json({
//           Filename: `${pool}/file/${uploadedFilename}`,
//           result: result
//       });
//   } catch (e) {
//       console.log(e);
//       res.sendStatus(500);
//   }
// });

// Set up a route for file retrieval
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found.');
  }

  // Stream the file as the response
  res.sendFile(filePath);
}); 

// Endpoint for downloading files
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename); 

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err); 
      res.status(404).send('File not found.');
    }
  });
});

// const options = {
//   cert: fs.readFileSync(`${process.env.HOME}/cert/cert.pem`),
//   key: fs.readFileSync(`${process.env.HOME}/cert/key.pem`)
// };

// https.createServer(options, app).listen(process.env.APPPORT || '3003', () => {
//   console.log('app is listening to port' + process.env.APPPORT);
// });


app.listen(process.env.APPPORT || '3003', () => {
  console.log('app is listening to port' + process.env.APPPORT);
});