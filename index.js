const express = require('express');
require('dotenv').config();
const cors = require('cors');
const https = require('https');

// const axios = require('axios');


// const membersDbOperations = require('./cruds/member'); 

// Peses pay
const { Pesepay } = require('pesepay');

//Payment Gateway

// const resultUrl = 'http://localhost:3000/dashboard'; // Update with your result URL
// const returnUrl = 'http://localhost:3000/dashboard'; // Update with your return URL
const resultUrl = 'https://tantak-portal.netlify.app/dashboard'; // Update with your result URL
const returnUrl = 'https://tantak-portal.netlify.app/dashboard'; // Update with your return URL
const pesepayInstance = new Pesepay("96aa2f37-063a-4b4f-ae30-c6332e985db8", "f3e0d62f7b6640f5b3fef5e8d545278e");

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
const accountRouter = require('./routes/account');
const pendingRouter = require('./routes/acc_pending');

const corsOptions = {
  // origin: ['http://localhost:3000', 'http://localhost:3003/account/cashout' ],
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

//App Route Usage
app.use('/users', userRouter);
app.use('/mailer', mailerRouter);
app.use('/onboarding', onBoardingRouter);
app.use('/colleges', authenticateToken, collegesRouter);
app.use('/courses', authenticateToken, coursesRouter);
app.use('/modules', authenticateToken, modulesRouter);
app.use('/lessons', authenticateToken, lessonsRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/assignments', authenticateToken, assignmentsRouter);
app.use('/notes', authenticateToken, notesRouter);
app.use('/results', authenticateToken, resultsRouter);
app.use('/feedback', authenticateToken, feedbackRouter);
app.use('/account', accountRouter);
app.use('/accpending', pendingRouter);

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

// app.get('/initiate-payment/:course_id/:module_id/:student_id/:amount/:exp_date', async (req, res) => {

//   console.log("Point reached")

//   const course_id = req.params.course_id;
//   const module_id = req.params.module_id;
//   const student_id = req.params.student_id;
//   const amount = req.params.amount;
//   const exp_date = req.params.exp_date;

//   const axios = require('axios');

//   // Sample data to post
//   const data = {
//     course_id,
//     module_id,
//     student_id,
//     amount,
//     exp_date
//   };

//   const data2 = {
//     module_id,
//     student_id,
//     amount
//   };

//   // Post request
//   axios.post(`${pool}/subscriptions/`, data)
//     .then(response => {
//       console.log('Response Data:', response.data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });

//   // Post to accounts
//   axios.post(`${pool}/account/`, data2)
//     .then(response => {
//       console.log('Response Data:', response.data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });

// }

// );

app.get('/initiate-payment/:course_id/:module_id/:student_id/:amount/:exp_date', async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const module_id = req.params.module_id;
    const student_id = req.params.student_id;
    const amount = req.params.amount;
    const exp_date = req.params.exp_date;


    const currencyCode = 'USD'; // Update with the actual currency code
    const paymentReason = 'E-Learning subscription'; // Update with the actual payment reason

    const transaction = pesepayInstance.createTransaction(amount, currencyCode, paymentReason);

    pesepayInstance.resultUrl = resultUrl;
    pesepayInstance.returnUrl = returnUrl;

    pesepayInstance.initiateTransaction(transaction).then(response => {
      console.log(response);
      if (response.success) {
        const redirectUrl = response.redirectUrl;
        const referenceNumber = response.referenceNumber;
        const pollUrl = response.pollUrl;

        // Check payment status
        pesepayInstance.pollTransaction(pollUrl).then(response => {
          if (response.success) {
            if (response.paid) {
              console.log('Payment was successful');
            } else {
              console.log('Payment is pending');

              let loops = 0;
              let paymentProcessed = false; // Flag to prevent double posting
              const intervalId = setInterval(() => {
                pesepayInstance.checkPayment(referenceNumber).then(response => {
                  if (response.success) {
                    if (response.paid && !paymentProcessed) {
                      console.log('Payment was successful');

                      const axios = require('axios');

                      // Sample data to post
                      const data = {
                        course_id,
                        module_id,
                        student_id,
                        amount,
                        exp_date
                      };

                      const data2 = {
                        module_id,
                        student_id,
                        amount
                      };

                      // Post request
                      axios.post(`${pool}/subscriptions/`, data)
                        .then(response => {
                          console.log('Response Data:', response.data);
                        })
                        .catch(error => {
                          console.error('Error:', error);
                        });

                      // Post to accounts
                      axios.post(`${pool}/account/`, data2)
                        .then(response => {
                          console.log('Response Data:', response.data);
                        })
                        .catch(error => {
                          console.error('Error:', error);
                        });

                      paymentProcessed = true; // Set the flag to true to prevent further posting
                      clearInterval(intervalId);
                    }
                  } else {
                    console.error(`Error: ${response.message}`);
                  }
                }).catch(error => {
                  console.error(error);
                });
                loops++;
                if (loops >= 18) {
                  clearInterval(intervalId);
                }
              }, 5000); // Check every 5 seconds
            }
          } else {
            console.error(`Error: ${response.message}`);
          }
        }).catch(error => {
          console.error(error);
        });

        res.redirect(redirectUrl);
      } else {
        console.error(`Error: ${response.message}`);
        res.status(500).send({ error: 'Failed to initiate payment' });
      }
    }).catch(error => {
      console.error(error);
      res.status(500).send({ error: 'Failed to initiate payment' });
    });



  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
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