require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

// Create a new lesson
crudsObj.postLesson = (module_id, lesson_no, topic, objectives, assignment, video, release_date) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO lessons(module_id, lesson_no, topic, objectives, assignment, video, release_date) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [module_id, lesson_no, topic, objectives, assignment, video, release_date], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Lesson record added successfully' });
            }
        );
    });
};

// Get all lessons
crudsObj.getLessons = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM lessons', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Get lesson by ID
crudsObj.getLessonById = (lesson_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM lessons WHERE lesson_id = ?', [lesson_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Get lesson by module ID
crudsObj.getLessonModById = (modID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM lessons WHERE module_id = ?', [modID], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Update lesson by ID
crudsObj.updateLesson = (lesson_id, module_id, lesson_no, topic, objectives, assignment, video, date_posted, release_date) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE lessons SET module_id = ?, lesson_no = ?, topic = ?, objectives = ?, assignment = ?, video = ?, date_posted = ?, release_date = ? WHERE lesson_id = ?',
            [module_id, lesson_no, topic, objectives, assignment, video, date_posted, release_date, lesson_id], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Lesson record updated successfully' });
            });
    });
};

// Delete lesson by ID
crudsObj.deleteLesson = (lesson_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM lessons WHERE lesson_id = ?', [lesson_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Lesson record deleted successfully' });
        });
    });
};

module.exports = crudsObj;
