const express = require('express');
const accountRouter = express.Router();
const accountDbOperations = require('../cruds/account');

const authenticateToken = require('../utilities/authenticateToken'); 

// Create a new record
accountRouter.post('/', async (req, res) => {
    try {
        const { module_id, student_id, amount } = req.body;
        console.log(req.body);
        const account = await accountDbOperations.postAccount(module_id, student_id, amount);
        res.json(account);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Cash out
accountRouter.post('/cashout', async (req, res) => {
    try {
        const { college_id, amount, ecocash, name, surname } = req.body;
        console.log(req.body);
        const account = await accountDbOperations.postAccountCashout(college_id, ecocash, name, surname, amount);
        res.json(account);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all records
accountRouter.get('/', authenticateToken, async (req, res) => {
    try {
        const account = await accountDbOperations.getAccounts();
        res.json(account);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all college balances
accountRouter.get('/admin/college/all/bal', authenticateToken, async (req, res) => {
    try {
        const account = await accountDbOperations.getAllBal();
        res.json(account);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get record by ID
accountRouter.get('/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await accountDbOperations.getAccountById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get result by ID
accountRouter.get('/bal/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await accountDbOperations.getAccountBal(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get transactions by ID
accountRouter.get('/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await accountDbOperations.getAccountTrans(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get pending by ID
accountRouter.get('/acc/pending/bal', authenticateToken, async (req, res) => {
    try {
        const result = await accountDbOperations.getAccountPending();
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete account record by ID
accountRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await accountDbOperations.deleteAccount(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = accountRouter;
