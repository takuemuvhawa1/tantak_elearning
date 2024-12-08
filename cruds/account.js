require('dotenv').config();
const pool = require('./poolfile');
const poolapi = require('./poolapi');

const axios = require('axios');

let accountObj = {};

accountObj.postAccount = (module_id, student_id, amount) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT email FROM users WHERE user_id = ?', [student_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'student not found' });
            } else {
                const user = results[0];
                const studentEmail = user.email;

                pool.query('SELECT m.name AS moduleName, c.name AS courseName, cl.college_id, cl.name AS collegeName FROM modules m JOIN courses c ON c.course_id = m.course_id JOIN colleges cl ON c.college_id = cl.college_id WHERE m.module_id = ?', [module_id], async (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    if (results.length === 0) {
                        return resolve({ status: '401', message: 'course not found' });
                    } else {
                        const course = results[0];
                        const moduleName = course.moduleName;
                        const courseName = course.courseName;
                        const college_id = course.college_id;
                        const reason = "Subscription Fee"
                        const cash_out = 0;
                        let cash_in = Number(amount) * 0.83
                        let adminCashIn = Number(amount) * 0.17


                        pool.query('SELECT balance FROM college_acc WHERE college_id = ? ORDER BY account_id DESC LIMIT 1', [college_id], async (err, results) => {
                            if (err) {
                                return reject(err);
                            }
                            if (results.length === 0) {
                                // return resolve({ status: '401', message: 'course not found' });
                                pool.query('INSERT INTO college_acc(college_id, course_id, module_id, student_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                    [college_id, courseName, moduleName, studentEmail, reason, cash_in, cash_out, cash_in],
                                    (err, result) => {
                                        if (err) return reject(err);
                                        return resolve({ status: '200', message: 'Account record added successfully' });
                                    }
                                );
                            } else {

                                const data = results[0];
                                const bal = data.balance;
                                let newBal = Number(bal) + Number(cash_in);

                                pool.query('INSERT INTO college_acc(college_id, course_id, module_id, student_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                    [college_id, courseName, moduleName, studentEmail, reason, cash_in, cash_out, newBal],
                                    (err, result) => {
                                        if (err) return reject(err);
                                        return resolve({ status: '200', message: 'Account record added successfully' });
                                    }
                                );
                            }

                            pool.query('SELECT balance FROM college_acc WHERE college_id = 0 ORDER BY account_id DESC LIMIT 1', async (err, results) => {
                                if (err) {
                                    return reject(err);
                                }
                                const adminAcc = 0;
                                const adminData = results[0];
                                const adminBal = adminData.balance;
                                let newAdminBal = Number(adminBal) + Number(adminCashIn);

                                pool.query('INSERT INTO college_acc(college_id, course_id, module_id, student_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                    [adminAcc, courseName, moduleName, studentEmail, reason, adminCashIn, cash_out, newAdminBal],
                                    (err, result) => {
                                        if (err) return reject(err);
                                        return resolve({ status: '200', message: 'Account record added successfully' });
                                    });
                            });

                        });

                        // pool.query('INSERT INTO college_acc(college_id, course_id, module_id, student_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        //     [college_id, courseName, moduleName, studentEmail, reason, amount, cash_out, amount],
                        //     (err, result) => {
                        //         if (err) return reject(err);
                        //         return resolve({ status: '200', message: 'Account record added successfully' });
                        //     }
                        // );
                    }
                });

            }

        });
    });
};

accountObj.postAccountCashout = (college_id, ecocash, name, surname, amount) => {
    return new Promise((resolve, reject) => {
        const cash_in = 0;
        const reason = "Cashout"
        pool.query(
            'INSERT INTO college_acc(college_id, course_id, module_id, student_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [college_id, name, surname, ecocash, reason, cash_in, amount, cash_in],
            (err, result) => {
                if (err) return reject(err);

                let details = `Ecocash No: ${ecocash}, ${name}  ${surname}`

                const data = {
                    college_id,
                    amount,
                    details
                };

                // Post to accounts
                axios.post(`${poolapi}/accpending/`, data)
                    .then(response => {
                        console.log('Response Data:', response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                return resolve({ status: '200', message: 'Result record added successfully' });
            }
        );
    });
};

accountObj.getAccounts = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAllBal = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT c.*, (SELECT a.balance FROM college_acc a WHERE a.college_id = c.college_id ORDER BY a.account_id DESC LIMIT 1) AS balance FROM colleges c`, (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountBal = (college_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT balance FROM college_acc WHERE college_id = ? ORDER BY account_id DESC LIMIT 1', [college_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                let bal = 0.00
                return resolve({ status: '401', message: 'Account balance retrived', bal });
            } else {

                const data = results[0];
                const bal = data.balance;

                return resolve({ status: '200', message: 'Account balance retrived', bal });

            }
        });
    });
};

accountObj.getAccountTrans = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM college_acc WHERE college_id = ? ORDER BY account_id DESC', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountPending = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT c.*, p.balance, p.pending_id, p.date, p.details FROM colleges c JOIN ( SELECT college_id, balance, pending_id, details, date FROM pending_bal WHERE (college_id, pending_id) IN (SELECT college_id, MAX(pending_id) FROM pending_bal GROUP BY college_id ) ) p ON c.college_id = p.college_id WHERE p.balance > 0 AND p.balance IS NOT NULL`, (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountById = (result_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results WHERE result_id = ?', [result_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountCollegeById = (modID, stuID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results WHERE module_id = ? AND student_id = ?', [modID, stuID], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.updateAccount = (result_id, module_id, student_id, assignment_id, marks, percentage, grade, date) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE results SET module_id = ?, student_id = ?, assignment_id = ?, marks = ?, percentage = ?, grade = ?, date = ? WHERE result_id = ?',
            [module_id, student_id, assignment_id, marks, percentage, grade, date, result_id],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Account record updated successfully' });
            });
    });
};

accountObj.deleteAccount = (result_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM results WHERE result_id = ?', [result_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Account record deleted successfully' });
        });
    });
};

module.exports = accountObj;