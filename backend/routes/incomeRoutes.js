const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middlewares/authMiddleware.js')

const {
    addIncome,
    getAllIncome, 
    deleteIncome,
    downloadIncomeExcel
} = require('../controllers/incomeController.js')


router.post('/addIncome', verifyToken, addIncome)
router.get('/getAllIncome', verifyToken, getAllIncome)
router.delete('/deleteIncome/:id', verifyToken, deleteIncome)
router.get('/downloadIncomeExcel', verifyToken, downloadIncomeExcel)

module.exports = router