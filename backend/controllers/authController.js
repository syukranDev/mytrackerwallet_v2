const jwt = require('jsonwebtoken')
const db = require('../config/db.js')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30m' })
}

exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try { 
        const userExists = await db.users.findOne({ where: { email } })
    
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }
    
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await db.users.create({ id: uuidv4(), fullName, email, password: hashedPassword })

        res.status(201).json({
            user,
            token: generateToken(user.id)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: 'All fields are required' })

    try { 
        const user = await db.users.findOne({ where: { email } })
        if (!user) return res.status(401).json({ message: 'Invalid credentials' })

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(401).json({ message: 'Invalid credentials' })

        const token = generateToken(user.id)

        res.status(200).json({ user, token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}


exports.getUserInfo = async (req, res) => {
    const { id } = req.token
    try { 
        const user = await db.users.findOne({ where: { id } })
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}