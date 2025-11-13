const db = require('../config/db.js')
const { Op } = require('sequelize')

exports.getAllDestinations = async (req, res) => {
    const userId = req.token.id
    try {
        const destinations = await db.incomeDestinations.findAll({ 
            where: { userId },
            order: [['name', 'ASC']]
        })
        res.status(200).json({ destinations })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.addDestination = async (req, res) => {
    const userId = req.token.id
    const { name } = req.body
    
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Destination name is required' })
    }

    try {
        // Check if destination already exists for this user
        const existing = await db.incomeDestinations.findOne({ 
            where: { userId, name: name.trim() } 
        })
        
        if (existing) {
            return res.status(400).json({ message: 'Destination already exists' })
        }

        const destination = await db.incomeDestinations.create({ 
            userId, 
            name: name.trim() 
        })
        res.status(201).json({ destination })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.deleteDestination = async (req, res) => {
    const userId = req.token.id
    const { id } = req.params
    try {
        const result = await db.incomeDestinations.destroy({ 
            where: { userId, id } 
        })
        
        if (result === 0) {
            return res.status(404).json({ message: 'Destination not found' })
        }
        
        res.status(200).json({ message: 'Destination deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.updateDestination = async (req, res) => {
    const userId = req.token.id
    const { id } = req.params
    const { name } = req.body
    
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Destination name is required' })
    }

    try {
        // Check if another destination with the same name exists
        const existing = await db.incomeDestinations.findOne({ 
            where: { 
                userId, 
                name: name.trim(),
                id: { [Op.ne]: id }
            } 
        })
        
        if (existing) {
            return res.status(400).json({ message: 'Destination name already exists' })
        }

        const [updated] = await db.incomeDestinations.update(
            { name: name.trim() },
            { where: { userId, id } }
        )
        
        if (updated === 0) {
            return res.status(404).json({ message: 'Destination not found' })
        }
        
        const destination = await db.incomeDestinations.findOne({ where: { id } })
        res.status(200).json({ destination })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

