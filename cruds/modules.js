require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postModule = (course_id, name, description, instructor, profile_pic) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO modules(course_id, name, description, teacher, profile_pic) VALUES (?, ?, ?, ?, ?)', 
            [course_id, name, description, instructor, profile_pic], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Module record added successfully' });
            }
        );
    });
};

crudsObj.getModules = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM modules', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

crudsObj.getModuleById = (module_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM modules WHERE module_id = ?', [module_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

crudsObj.getModuleByCourseId = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM modules WHERE course_id = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

crudsObj.updateModule = (module_id, course_id, name, description, instructor, profile_pic) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE modules SET course_id = ?, name = ?, description = ?, teacher = ?, profile_pic = ? WHERE module_id = ?',
            [course_id, name, description, instructor, profile_pic, module_id], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Module record updated successfully' });
            });
    });
};

crudsObj.deleteModule = (module_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM modules WHERE module_id = ?', [module_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Module record deleted successfully' });
        });
    });
};

module.exports = crudsObj;
