require('dotenv').config();
const pool = require('./poolfile');

let notesObj = {};

notesObj.postNote = (module_id, title, author, path) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO notes(module_id, title, author, path) VALUES (?, ?, ?, ?)', 
            [module_id, title, author, path], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Note record added successfully' });
            }
        );
    });
};

notesObj.getNotes = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM notes', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

notesObj.getNoteById = (notes_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM notes WHERE notes_id = ?', [notes_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

notesObj.getNoteModById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM notes WHERE module_id = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

notesObj.updateNote = (notes_id, module_id, title, author) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE notes SET module_id = ?, title = ?, author = ? WHERE notes_id = ?',
            [module_id, title, author, notes_id], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Note record updated successfully' });
            });
    });
};

notesObj.deleteNote = (notes_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM notes WHERE notes_id = ?', [notes_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Note record deleted successfully' });
        });
    });
};

module.exports = notesObj;
