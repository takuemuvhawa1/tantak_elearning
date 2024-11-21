require('dotenv').config();
const pool = require('./poolfile');

let assignmentsObj = {};

assignmentsObj.postAssignment = (module_id, type, topic, path) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO assignments(module_id, type, topic, path) VALUES (?, ?, ?, ?)', 
            [module_id, type, topic, path], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Assignment record added successfully' });
            }
        );
    });
};

assignmentsObj.getAssignments = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM assignments', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

assignmentsObj.getAssignmentById = (assignment_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM assignments WHERE assignment_id = ?', [assignment_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

assignmentsObj.getAssignmentModById = (modID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM assignments WHERE module_id = ?', [modID], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

assignmentsObj.updateAssignment = (assignment_id, module_id, type, topic, description) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE assignments SET module_id = ?, type = ?, topic = ?, description = ? WHERE assignment_id = ?',
            [module_id, type, topic, description, assignment_id], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Assignment record updated successfully' });
            });
    });
};

assignmentsObj.deleteAssignment = (assignment_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM assignments WHERE assignment_id = ?', [assignment_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Assignment record deleted successfully' });
        });
    });
};

module.exports = assignmentsObj;
