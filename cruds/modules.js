require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postModule = (course_id, name, description, instructor, price, profile_pic) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT user_id FROM users WHERE email = ?', [instructor], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'Email not found' });
            }else{

                const user = results[0];
                const teacher = user.user_id;
    
                pool.query(
                    'INSERT INTO modules(course_id, name, description, teacher, price, profile_pic) VALUES (?, ?, ?, ?, ?, ?)',
                    [course_id, name, description, teacher, price, profile_pic],
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve({ status: '200', message: 'Module record added successfully' });
                    }
                );
            }

        });
    });
};
crudsObj.postModule2 = (course_id, name, description, instructor, price, profile_pic) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO modules(course_id, name, description, teacher, price, profile_pic) VALUES (?, ?, ?, ?, ?, ?)',
            [course_id, name, description, instructor, price, profile_pic],
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
        pool.query('SELECT m.*, u.name AS teacherName, u.surname, u.email FROM modules m JOIN users u ON u.user_id = m.teacher WHERE course_id = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

crudsObj.getModuleByTeacherId = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT m.module_id, m.name AS module_name, c.name AS course_name, cr.name AS level_name FROM modules m JOIN courses cr ON cr.course_id = m.course_id JOIN colleges c ON c.college_id = cr.college_id WHERE m.teacher = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

crudsObj.updateModule = (module_id, course_id, name, description, instructor, price) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT user_id FROM users WHERE email = ?', [instructor], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'Email not found' });
            }else{

                const user = results[0];
                const teacher = user.user_id;
    
                pool.query('UPDATE modules SET course_id = ?, name = ?, description = ?, teacher = ?, price = ? WHERE module_id = ?',
                    [course_id, name, description, teacher, price, module_id],
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve({ status: '200', message: 'Module record updated successfully' });
                    });
            }

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
