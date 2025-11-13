const db = require('../config/db.js')

const toNumber = (value) => {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? 0 : parsed
}

exports.getAllTransactions = async (req, res) => {
    const userId = req.token.id
    const page = parseInt(req.query.page) || 1
    const limit = 10 // Fixed at 10 per page
    const offset = (page - 1) * limit

    try {
        // Get all incomes
        const allIncomes = await db.incomes.findAll({
            where: { userId },
            order: [['created_at', 'DESC']]
        })

        // Get all expenses
        const allExpenses = await db.expenses.findAll({
            where: { userId },
            order: [['created_at', 'DESC']]
        })

        // Mark income transactions with type
        const incomeTransactionsWithType = allIncomes.map((transaction) => {
            const plain = transaction.get({ plain: true })
            return {
                ...plain,
                amount: toNumber(plain.amount),
                type: 'income'
            }
        })

        // Mark expense transactions with type
        const expenseTransactionsWithType = allExpenses.map((transaction) => {
            const plain = transaction.get({ plain: true })
            return {
                ...plain,
                amount: toNumber(plain.amount),
                type: 'expense'
            }
        })

        // Combine and sort by date
        const allTransactions = [...incomeTransactionsWithType, ...expenseTransactionsWithType]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        // Get total count
        const totalCount = allTransactions.length

        // Apply pagination
        const paginatedTransactions = allTransactions.slice(offset, offset + limit)

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1

        res.json({
            transactions: paginatedTransactions,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage,
                hasPrevPage
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

