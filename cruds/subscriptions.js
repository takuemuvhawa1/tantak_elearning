require('dotenv').config();
const pool = require('./poolfile');

let subscriptionsObj = {};

subscriptionsObj.postSubscription = (course_id, student_id, exp_date) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO subscriptions(course_id, student_id, exp_date) VALUES (?, ?, ?)', 
            [course_id, student_id, exp_date], 
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

subscriptionsObj.getSubscriptionByStudentIdAndCourse = (studentId, courseId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM subscriptions WHERE student_id = ? AND course_id = ?', [studentId, courseId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

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
