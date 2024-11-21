require('dotenv').config();
const pool = require('./poolfile');

let collegesObj = {};

collegesObj.postCollege = (name, description, profile_pic, adminId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO colleges(name, description, profile_pic, admin_id) VALUES (?, ?, ?, ?)', 
            [name, description, profile_pic, adminId], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'College record added successfully' });
            }
        );
    });
};

collegesObj.getColleges = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM colleges', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

collegesObj.getCollegeById = (college_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM colleges WHERE college_id = ?', [college_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

collegesObj.getCollegeByAdminId = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM colleges WHERE admin_id = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

collegesObj.updateCollege = (college_id, name, description, profile_pic, adminId) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE colleges SET name = ?, description = ?, profile_pic = ?, admin_id = ?  WHERE college_id = ?',
            [name, description, profile_pic, adminId, college_id], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'College record updated successfully' });
            });
    });
};

collegesObj.deleteCollege = (collegeId) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM colleges WHERE college_id = ?', [collegeId], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'College record deleted successfully' });
        });
    });
};

module.exports = collegesObj;
