const express = require('express');
const subscriptionsRouter = express.Router();
const subscriptionsDbOperations = require('../cruds/subscriptions');

// Create a new subscription
subscriptionsRouter.post('/', async (req, res) => {
    try {
        const { course_id, student_id, exp_date } = req.body;
        const results = await subscriptionsDbOperations.postSubscription(course_id, student_id, exp_date);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all subscriptions
subscriptionsRouter.get('/', async (req, res) => {
    try {
        const results = await subscriptionsDbOperations.getSubscriptions();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get subscription by ID
subscriptionsRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await subscriptionsDbOperations.getSubscriptionById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get subscription by student ID AND Course
subscriptionsRouter.get('/student/:studentId/:courseId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const courseId = req.params.courseId;
        const result = await subscriptionsDbOperations.getSubscriptionByStudentIdAndCourse(studentId, courseId);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update subscription by ID
subscriptionsRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { course_id, student_id, exp_date } = req.body;
        const result = await subscriptionsDbOperations.updateSubscription(id, course_id, student_id, exp_date);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete subscription by ID
subscriptionsRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await subscriptionsDbOperations.deleteSubscription(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = subscriptionsRouter;
