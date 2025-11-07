const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middlewares/authMiddleware.js')

const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel
} = require('../controllers/expenseController.js')


router.post('/addExpense', verifyToken, addExpense)
router.get('/getAllExpense', verifyToken, getAllExpense)
router.delete('/deleteExpense/:id', verifyToken, deleteExpense)
router.get('/downloadExpenseExcel', verifyToken, downloadExpenseExcel)

module.exports = router