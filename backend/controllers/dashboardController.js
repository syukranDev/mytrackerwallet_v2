const db = require('../config/db.js')

const toNumber = (value) => {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? 0 : parsed
}

exports.getDashboardData = async (req, res) => {
    const userId = req.token.id
    try {
        const totalIncomeSum = toNumber(await db.incomes.sum('amount', { where: { userId } }))
        const totalExpenseSum = toNumber(await db.expenses.sum('amount', { where: { userId } }))
        
        const last60daysincomeTransactionsRaw = await db.incomes.findAll({
            where: { userId },
            order: [['created_at', 'DESC']],
            limit: 60
        })
        const last30DaysExpenseTransactionsRaw = await db.expenses.findAll({
            where: { userId },
            order: [['created_at', 'DESC']],
            limit: 30
        })

        const last60daysincomeTransactions = last60daysincomeTransactionsRaw.map((transaction) => {
            const plain = transaction.get({ plain: true })
            return {
                ...plain,
                amount: toNumber(plain.amount)
            }
        })

        const last30DaysExpenseTransactions = last30DaysExpenseTransactionsRaw.map((transaction) => {
            const plain = transaction.get({ plain: true })
            return {
                ...plain,
                amount: toNumber(plain.amount)
            }
        })

        const totalIncomeLast60days = last60daysincomeTransactions.reduce((acc, transaction) => acc + toNumber(transaction.amount), 0)
        const totalExpenseLast30Days = last30DaysExpenseTransactions.reduce((acc, transaction) => acc + toNumber(transaction.amount), 0)

        const expenseCount30Days = last30DaysExpenseTransactions.length
        const avgExpense30Days = expenseCount30Days ? Number((totalExpenseLast30Days / expenseCount30Days).toFixed(2)) : 0

        const incomeCount60Days = last60daysincomeTransactions.length
        const avgIncome60Days = incomeCount60Days ? Number((totalIncomeLast60days / incomeCount60Days).toFixed(2)) : 0

        const expenseByCategory = last30DaysExpenseTransactions.reduce((acc, transaction) => {
            const category = transaction?.category || 'Others'
            acc[category] = (acc[category] || 0) + toNumber(transaction.amount)
            return acc
        }, {})

        const topExpenseCategories = Object.entries(expenseByCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([category, amount]) => ({
                category,
                amount: Number(amount.toFixed(2)),
                percentage: totalExpenseLast30Days > 0 ? Math.round((amount / totalExpenseLast30Days) * 100) : 0
            }))

        const latestIncome = last60daysincomeTransactions[0] || null

        const recentTransactions = [...last60daysincomeTransactions, ...last30DaysExpenseTransactions]
            .map((transaction) => ({
                ...transaction,
                type: transaction.source ? 'income' : 'expense'
            }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)

        res.json({
            totalBalance: Number((totalIncomeSum - totalExpenseSum).toFixed(2)),
            totalIncome: totalIncomeSum,
            totalExpense: totalExpenseSum,
            last30DaysExpenseTransactions: {
                total: Number(totalExpenseLast30Days.toFixed(2)),
                count: expenseCount30Days,
                average: avgExpense30Days,
                topCategories: topExpenseCategories,
                transactions: last30DaysExpenseTransactions
            },
            last60DaysIncome: {
                total: Number(totalIncomeLast60days.toFixed(2)),
                count: incomeCount60Days,
                average: avgIncome60Days,
                latest: latestIncome,
                transactions: last60daysincomeTransactions
            },
            recentTransactions
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}