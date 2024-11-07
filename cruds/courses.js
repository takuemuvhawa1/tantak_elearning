require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postCourse = (college_id, name, description, instructor, profile_pic) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO courses(college_id, name, description, instructor, profile_pic) VALUES (?, ?, ?, ?, ?)', 
            [college_id, name, description, instructor, profile_pic], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Course record added successfully' });
            }
        );
    });
};

crudsObj.getCourses = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM courses', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

crudsObj.getCourseById = (course_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM courses WHERE course_id = ?', [course_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

crudsObj.getCourseByCollegeId = (course_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM courses WHERE college_id = ?', [course_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

crudsObj.updateCourse = (course_id, college_id, name, description, instructor, profile_pic) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE courses SET college_id = ?, name = ?, description = ?, instructor = ?, profile_pic = ?  WHERE course_id = ?',
            [college_id, name, description, instructor, profile_pic, course_id], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Course record updated successfully' });
            });
    });
};

crudsObj.deleteCourse = (course_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM courses WHERE course_id = ?', [course_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Course record deleted successfully' });
        });
    });
};

module.exports = crudsObj;
