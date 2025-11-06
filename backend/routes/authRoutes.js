const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middlewares/authMiddleware.js')
const { upload } = require('../middlewares/uploadMiddleware.js')

const { 
   registerUser, 
   loginUser, 
   getUserInfo } = require('../controllers/authController.js')


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/getUser', verifyToken, getUserInfo)

router.post('/uploadProfileImage',upload.single('image'), (req,res) => {
   if(!req.file) return res.status(400).json({ message: 'No file uploaded' })

   const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
   res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl })
})

module.exports = router