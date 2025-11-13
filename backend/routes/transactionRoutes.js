const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middlewares/authMiddleware.js')

const {
    getAllTransactions
} = require('../controllers/transactionController.js')

router.get('/getAllTransactions', verifyToken, getAllTransactions)

module.exports = router

