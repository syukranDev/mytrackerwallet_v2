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

        // First, get the destination to check its name
        const destination = await db.incomeDestinations.findOne({ 
            where: { userId, id } 
        })
        
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' })
        }
        
        const destinationName = destination.name
        
        // Check if this destination is used in any income transactions (to field)
        const incomeCount = await db.incomes.count({
            where: {
                userId,
                to: destinationName
            }
        })
        
        // Check if this destination is used in any expense transactions (source field)
        const expenseCount = await db.expenses.count({
            where: {
                userId,
                source: destinationName
            }
        })
        
        if (incomeCount > 0 || expenseCount > 0) {
            const usedIn = []
            if (incomeCount > 0) usedIn.push(`${incomeCount} income transaction(s)`)
            if (expenseCount > 0) usedIn.push(`${expenseCount} expense transaction(s)`)
            
            return res.status(400).json({ 
                message: `Cannot delete destination "${destinationName}" because it is being used in ${usedIn.join(' and ')}. Please delete or update those transactions first.` 
            })
        }
        
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
        // First, get the current destination to check its old name
        const currentDestination = await db.incomeDestinations.findOne({ 
            where: { userId, id } 
        })
        
        if (!currentDestination) {
            return res.status(404).json({ message: 'Destination not found' })
        }
        
        const oldName = currentDestination.name
        const newName = name.trim()
        
        // If the name hasn't changed, allow the update
        if (oldName === newName) {
            const destination = await db.incomeDestinations.findOne({ where: { id } })
            return res.status(200).json({ destination })
        }
        
        // Check if the old name is used in any transactions
        const incomeCount = await db.incomes.count({
            where: {
                userId,
                to: oldName
            }
        })
        
        const expenseCount = await db.expenses.count({
            where: {
                userId,
                source: oldName
            }
        })
        
        if (incomeCount > 0 || expenseCount > 0) {
            const usedIn = []
            if (incomeCount > 0) usedIn.push(`${incomeCount} income transaction(s)`)
            if (expenseCount > 0) usedIn.push(`${expenseCount} expense transaction(s)`)
            
            return res.status(400).json({ 
                message: `Cannot edit destination "${oldName}" because it is being used in ${usedIn.join(' and ')}. Please delete or update those transactions first.` 
            })
        }
        
        // Check if another destination with the new name exists
        const existing = await db.incomeDestinations.findOne({ 
            where: { 
                userId, 
                name: newName,
                id: { [Op.ne]: id }
            } 
        })
        
        if (existing) {
            return res.status(400).json({ message: 'Destination name already exists' })
        }

        const [updated] = await db.incomeDestinations.update(
            { name: newName },
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

