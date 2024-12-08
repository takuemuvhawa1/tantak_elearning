require('dotenv').config();
const pool = require('./poolfile');

let subscriptionsObj = {};

subscriptionsObj.postSubscription = (course_id, module_id, student_id, amount, exp_date) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO subscriptions(course_id, module_id, student_id, amount, exp_date) VALUES (?, ?, ?, ?, ?)',
            [course_id, module_id, student_id, amount, exp_date],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Subscription record added successfully' });
            }
        );
    });
};

subscriptionsObj.getSubscriptions = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM subscriptions', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

subscriptionsObj.getSubscriptionById = (subscription_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM subscriptions WHERE subscription_id = ?', [subscription_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

subscriptionsObj.getSubscriptionByStudentIdAndCourse = (studentId, courseId, currentDate) => {
    return new Promise((resolve, reject) => {
        console.log(studentId)
        console.log(courseId)
        console.log(currentDate)
        pool.query(`SELECT s.*, m.name AS module_name, c.name AS course_name, cr.name AS level_name FROM subscriptions s JOIN modules m ON m.module_id = s.module_id JOIN courses cr ON cr.course_id = s.course_id JOIN colleges c ON c.college_id = cr.college_id WHERE s.student_id = ? AND s.module_id = ? AND s.exp_date >= "${currentDate}"`, [studentId, courseId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

subscriptionsObj.getAllSubscriptionByStudentIdAndCourse = (studentId, currentDate) => {
    return new Promise((resolve, reject) => {
        console.log(currentDate)
        pool.query(`SELECT s.*, m.name AS module_name, c.name AS course_name, cr.name AS level_name FROM subscriptions s JOIN modules m ON m.module_id = s.module_id JOIN courses cr ON cr.course_id = s.course_id JOIN colleges c ON c.college_id = cr.college_id WHERE s.student_id = ? AND s.exp_date >= "${currentDate}"`, [studentId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

subscriptionsObj.getAllSubscriptionByModule = (moduleId, currentDate) => {
    return new Promise((resolve, reject) => {
        // pool.query('SELECT s.*, m.name AS module_name, c.name AS course_name, cr.name AS level_name, u.name AS student_name, u.Surname AS student_surname FROM subscriptions s JOIN modules m ON m.module_id = s.module_id JOIN courses cr ON cr.course_id = s.course_id JOIN colleges c ON c.college_id = s.course_id JOIN users u ON s.student_id = u.user_id WHERE s.module_id = ?', [moduleId], (err, results) => {
        pool.query(`SELECT s.subscription_id, s.date, s.exp_date, u.user_id AS student_id, u.name AS student_name, u.Surname AS student_surname, u.email FROM subscriptions s JOIN users u ON s.student_id = u.user_id WHERE s.module_id = ? AND s.exp_date >= "${currentDate}"`, [moduleId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

subscriptionsObj.getAllSubscriptionByCourse = (id, currentDate) => {
    return new Promise((resolve, reject) => {
        console.log(id);
        pool.query(`SELECT * FROM subscriptions WHERE course_id = ? AND exp_date > "${currentDate}"`, [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

subscriptionsObj.getAllSubscriptionByCollege = (id, currentDate) => {
    return new Promise((resolve, reject) => {
        console.log(id);
        pool.query(`SELECT s.subscription_id FROM subscriptions s JOIN courses c ON s.course_id = c.course_id INNER JOIN colleges cl ON cl.college_id = c.college_id WHERE cl.college_id = ? AND s.exp_date > "${currentDate}"`, [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// subscriptionsObj.getSubscriptionByStudentIdAndCourse = (studentId, courseId) => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM subscriptions WHERE student_id = ? AND module_id = ?', [studentId, courseId], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

subscriptionsObj.updateSubscription = (subscription_id, course_id, student_id, exp_date) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE subscriptions SET course_id = ?, student_id = ?, exp_date = ? WHERE subscription_id = ?',
            [course_id, student_id, exp_date, subscription_id],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Subscription record updated successfully' });
            });
    });
};

subscriptionsObj.deleteSubscription = (subscription_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM subscriptions WHERE subscription_id = ?', [subscription_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Subscription record deleted successfully' });
        });
    });
};

module.exports = subscriptionsObj;
