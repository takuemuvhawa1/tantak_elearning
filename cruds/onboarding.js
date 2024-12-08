require('dotenv').config();
const pool = require('./poolfile');
const axios = require('axios');
const poolapi = require('./poolapi');

let crudsObj = {};

crudsObj.postUser = (name, surname, email, phone, hashedPassword) => {
    return new Promise((resolve, reject) => {
        // const user_password = "25d55ad283aa400af464c76d713c07ad";
        pool.query('SELECT name FROM users WHERE email = ?',
            [email], (err, result) => {
                if (err) {
                    return reject(err);
                } else if (result.length > 0) {
                    return resolve({ status: '401', message: 'User already registered' });
                }

                pool.query('INSERT INTO users (name, surname, email, phone, password) VALUES (?, ?, ?, ?, ?)',
                    [name, surname, email, phone, hashedPassword], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve({ status: '200', message: 'User created successfully' });
                    });


                return resolve({ status: '200', message: 'User created successfully' });
            });
    });
};

crudsObj.postUserAdmin = (name, surname, email, phone, hashedPassword, collegeName, collegeDescription, path) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT user_id, name FROM users WHERE email = ?',
            [email], (err, result) => {
                if (err) {
                    return reject(err);
                } if (result.length > 0) {
                    const user = result[0];

                    pool.query('SELECT * FROM colleges WHERE admin_id = ?',
                        [user.user_id], (err, result) => {
                            if (err) {
                                return reject(err);
                            } if (result.length > 0) {
                                return resolve({ status: '402', message: 'This email is already registered with another college!' });
                            }
                        });

                    pool.query('SELECT * FROM colleges WHERE name = ?',
                        [collegeName], (err, result) => {
                            if (err) {
                                return reject(err);
                            } if (result.length > 0) {
                                return resolve({ status: '401', message: 'College name already registered' });
                            }
                            pool.query('INSERT INTO colleges (name, description, profile_pic, admin_id) VALUES (?, ?, ?, ?)',
                                [collegeName, collegeDescription, path, user.user_id], (err, result) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                });
                            return resolve({ status: '200', message: 'User created successfully' });
                        });

                } else {
                    pool.query('SELECT * FROM colleges WHERE name = ?',
                        [collegeName], (err, result) => {
                            if (err) {
                                return reject(err);
                            } else if (result.length > 0) {
                                return resolve({ status: '401', message: 'College name already registered' });
                            }
                            pool.query('INSERT INTO users (name, surname, email, phone, password) VALUES (?, ?, ?, ?, ?)',
                                [name, surname, email, phone, hashedPassword], (err, result) => {
                                    if (err) {
                                        return reject(err);
                                    }

                                    let admin = result.insertId
                                    console.log('InsertedId: ', admin);

                                    pool.query('INSERT INTO colleges (name, description, profile_pic, admin_id) VALUES (?, ?, ?, ?)',
                                        [collegeName, collegeDescription, path, admin], (err, result) => {
                                            if (err) {
                                                return reject(err);
                                            }
                                        });

                                    return resolve({ status: '200', message: 'User created successfully' });
                                });
                        });
                }

            });
    });
};

crudsObj.authenticateUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'Invalid email or password' });
            }
            const user = results[0]; // Get the user data from the results

            // Return user data without the password
            const { password, ...userData } = user; // Exclude password from user data
            return resolve({ status: '200', message: 'Login successful', user: userData });

        });
    });
};

crudsObj.resetPassword = async (email, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        // Check if the email exists and the old password is valid
        pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, oldPassword], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'Invalid email or password' });
            }

            // Update the password
            pool.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], async (err, results) => {
                if (err) {
                    return reject(err);
                }



                return resolve({ status: '200', message: 'Password reset successfully' });
            });
        });
    });
};

crudsObj.forgotPassword = async (email, newPassword) => {
    return new Promise((resolve, reject) => {
        // Update the password
        pool.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], async (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve({ status: '200', message: 'Password reset successfully' });
        });
    });
};

module.exports = crudsObj;
