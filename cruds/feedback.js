require('dotenv').config();
const pool = require('./poolfile');

let feedbackObj = {};

feedbackObj.postFeedback = (module_id, student_id, assignment_id, path, marked) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO feedback(module_id, student_id, assignment_id, path, marked) VALUES (?, ?, ?, ?, ?)', 
            [module_id, student_id, assignment_id, path, marked], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Feedback record added successfully' });
            }
        );
    });
};

feedbackObj.getFeedback = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM feedback', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

feedbackObj.getFeedbackById = (feedback_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM feedback WHERE feedback_id = ?', [feedback_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// //MARKED ASSIGNMENTS
// feedbackObj.getFeedbackMarkedById = (modID, stuID) => {
//     return new Promise((resolve, reject) => {
//         const marked = "T";
//         pool.query('SELECT * FROM feedback WHERE module_id = ? AND student_id = ? AND marked = ?', [modID, stuID, marked], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };
//MARKED ASSIGNMENTS
feedbackObj.getFeedbackSubmittedById = (modID, stuID) => {
    return new Promise((resolve, reject) => {
        const marked = "F";
        pool.query('SELECT f.*, a.topic, a.type, u.name, u.surname FROM feedback f JOIN assignments a ON a.assignment_id = f.assignment_id JOIN users u ON f.student_id = u.user_id WHERE f.module_id = ? AND f.student_id = ? AND f.marked = ?', [modID, stuID, marked], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

//SUBMIT ASSIGNMENTS
feedbackObj.getFeedbackMarkedById = (modID, stuID) => {
    return new Promise((resolve, reject) => {
        const marked = "T";
        pool.query('SELECT f.*, a.topic, a.type, u.name, u.surname FROM feedback f JOIN assignments a ON a.assignment_id = f.assignment_id JOIN users u ON f.student_id = u.user_id WHERE f.module_id = ? AND f.student_id = ? AND f.marked = ?', [modID, stuID, marked], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

feedbackObj.updateFeedback = (feedback_id, module_id, student_id, assignment_id, date, path, marked) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE feedback SET module_id = ?, student_id = ?, assignment_id = ?, date = ?, path = ?, marked = ? WHERE feedback_id = ?',
            [module_id, student_id, assignment_id, date, path, marked, feedback_id], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Feedback record updated successfully' });
            });
    });
};

feedbackObj.deleteFeedback = (feedback_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM feedback WHERE feedback_id = ?', [feedback_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Feedback record deleted successfully' });
        });
    });
};

module.exports = feedbackObj;
