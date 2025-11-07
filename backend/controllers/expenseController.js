const db = require('../config/db.js')
const xlsx = require('xlsx')

exports.addExpense = async (req, res) => {
    const userId = req.token.id
    const { icon, category, amount } = req.body
    
    if (!icon || !category || !amount) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const expense = await db.expenses.create({ userId, icon, category, amount })
        res.status(201).json({ expense })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.getAllExpense = async (req, res) => {
    const userId = req.token.id
    try {
        const expenses = await db.expenses.findAll({ where: { userId } })
        res.status(200).json({ expenses })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.deleteExpense = async (req, res) => {
    const userId = req.token.id
    const { id } = req.params
    try {
        const expense = await db.expenses.destroy({ where: { userId, id } })
        res.status(200).json({ message: 'Expense deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.token.id
    try {
        const expenses = await db.expenses.findAll({ where: { userId } })

        const data = expenses.map(expense => ({
            icon: expense.icon,
            category: expense.category,
            amount: expense.amount,
            created_at: expense.created_at,
            updated_at: expense.updated_at
        }))

        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(wb, ws, 'Expenses')
        xlsx.writeFile(wb, 'expenses.xlsx')
        res.download('expenses.xlsx')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}