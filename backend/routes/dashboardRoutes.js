const express = require('express')

const { verifyToken } = require('../middlewares/authMiddleware.js')

const {
    getDashboardData
} = require('../controllers/dashboardController.js')


const router = express.Router()

router.get('/', verifyToken, getDashboardData)

module.exports = router
