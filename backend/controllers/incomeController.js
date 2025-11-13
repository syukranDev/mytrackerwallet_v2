const db = require('../config/db.js')
const xlsx = require('xlsx')

exports.addIncome = async (req, res) => {
    const userId = req.token.id
    const { icon, amount, source, to } = req.body

    if (!userId || !icon || !amount || !source) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const income = await db.incomes.create({ userId, icon, amount, source, to: to || null })
        res.status(201).json({ income })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.getAllIncome = async (req, res) => {
    const userId = req.token.id
    try {
        const incomes = await db.incomes.findAll({ where: { userId } })
        res.status(200).json({ incomes })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.deleteIncome = async (req, res) => {
    const userId = req.token.id
    const { id } = req.params
    try {
        const income = await db.incomes.destroy({ where: { userId, id } })
        res.status(200).json({ message: 'Income deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.token.id
    try {
        const incomes = await db.incomes.findAll({ where: { userId } })

        const data = incomes.map(income => ({
            icon: income.icon,
            amount: income.amount,
            source: income.source,
            to: income.to,
            created_at: income.created_at,
            updated_at: income.updated_at
        }))

        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(wb, ws, 'Incomes')
        xlsx.writeFile(wb, 'incomes.xlsx')
        res.download('incomes.xlsx')

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message, success: false })
    }
}
