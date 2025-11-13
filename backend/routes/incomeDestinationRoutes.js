const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middlewares/authMiddleware.js')

const {
    getAllDestinations,
    addDestination,
    deleteDestination,
    updateDestination
} = require('../controllers/incomeDestinationController.js')

router.get('/getAllDestinations', verifyToken, getAllDestinations)
router.post('/addDestination', verifyToken, addDestination)
router.put('/updateDestination/:id', verifyToken, updateDestination)
router.delete('/deleteDestination/:id', verifyToken, deleteDestination)

module.exports = router

