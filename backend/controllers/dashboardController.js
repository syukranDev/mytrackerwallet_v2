const db = require('../config/db.js')

exports.getDashboardData = async (req, res) => {
    const userId = req.token.id
    try {
        const totalIncome = await db.incomes.sum('amount', { where: { userId } })
        const totalExpense = await db.expenses.sum('amount', { where: { userId } })
        
        const last60daysincomeTransactions = await db.incomes.findAll({ where: { userId }, order: [['created_at', 'DESC']], limit: 60 })
        const totalIncomeLast60days = last60daysincomeTransactions.reduce((acc, transaction) => acc + transaction.amount, 0)
        
        const last30DaysExpenseTransactions = await db.expenses.findAll({ where: { userId }, order: [['created_at', 'DESC']], limit: 30 })
        const totalExpenseLast30Days = last30DaysExpenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0)
        
        //last 5 transaction of income and expense, combine and sort by created_at
        const last5Transactions = [...last60daysincomeTransactions, ...last30DaysExpenseTransactions]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)

        res.json({
            totalBalance: totalIncome - totalExpense,
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            last30DaysExpenseTransactions: {
                total: totalExpenseLast30Days,
                transactions: last30DaysExpenseTransactions
            },
            last60DaysIncome: {
                total: totalIncomeLast60days,
                transactions: last60daysincomeTransactions
            },
            recentTransactions: last5Transactions
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}