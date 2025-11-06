require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const db = require('./config/db.js')

const app = express()

app.use(cors(
    {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
))

app.use(express.json())

app.use('/api/v1/auth', require('./routes/authRoutes.js'))
// app.use('api/v1/users', require('./routes/usersRoutes.js'))
// app.use('api/v1/expenses', require('./routes/expenseRoutes.js'))
// app.use('api/v1/incomes', require('./routes/incomesRoutes.js'))

// Serve uploaded images folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`)
})