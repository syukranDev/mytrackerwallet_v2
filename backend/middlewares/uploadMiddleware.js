const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

// file filter type allow image jpg png only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/jpg') || file.mimetype.startsWith('image/png')) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type - only jpg and png are allowed'), false)
    }
}

const upload = multer({ storage, fileFilter })

module.exports = { upload }