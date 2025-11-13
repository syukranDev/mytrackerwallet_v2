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

        // Mark income transactions with a type field
        const incomeTransactionsWithType = last60daysincomeTransactions.map((transaction) => ({
            ...transaction,
            type: 'income'
        }))
        
        // Mark expense transactions with a type field
        const expenseTransactionsWithType = last30DaysExpenseTransactions.map((transaction) => ({
            ...transaction,
            type: 'expense'
        }))

        const recentTransactions = [...incomeTransactionsWithType, ...expenseTransactionsWithType]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)

        // Calculate balance per source
        // Get all income destinations (LOVs) for this user
        const allIncomeDestinations = await db.incomeDestinations.findAll({
            where: { userId },
            order: [['name', 'ASC']]
        })

        // Get all income transactions to calculate income per source
        const allIncomeTransactionsRaw = await db.incomes.findAll({
            where: { userId },
            order: [['created_at', 'DESC']]
        })

        // Get all expense transactions to calculate expenses per source
        const allExpenseTransactionsRaw = await db.expenses.findAll({
            where: { userId },
            order: [['created_at', 'DESC']]
        })

        // Calculate income per LOV - sum all income transactions where 'to' field matches the LOV name
        const incomeByLOV = {}
        allIncomeTransactionsRaw.forEach((transaction) => {
            const plain = transaction.get({ plain: true })
            const to = (plain.to || '').trim()
            if (to) {
                const amount = toNumber(plain.amount)
                incomeByLOV[to] = (incomeByLOV[to] || 0) + amount
            }
        })

        // Calculate expenses per LOV - sum all expense transactions where 'source' field matches the LOV name
        const expenseByLOV = {}
        allExpenseTransactionsRaw.forEach((transaction) => {
            const plain = transaction.get({ plain: true })
            const source = (plain.source || '').trim()
            if (source) {
                const amount = toNumber(plain.amount)
                expenseByLOV[source] = (expenseByLOV[source] || 0) + amount
            }
        })

        // Calculate balance per LOV (income - expenses)
        // Include all income destinations, even if they have no transactions
        const sourceBalances = []
        
        allIncomeDestinations.forEach((destination) => {
            const plain = destination.get({ plain: true })
            const lovName = (plain.name || '').trim()
            // Match income by 'to' field and expense by 'source' field
            const income = incomeByLOV[lovName] || 0
            const expense = expenseByLOV[lovName] || 0
            const balance = income - expense
            
            sourceBalances.push({
                source: lovName,
                income: Number(income.toFixed(2)),
                expense: Number(expense.toFixed(2)),
                balance: Number(balance.toFixed(2))
            })
        })

        // Sort by balance descending
        sourceBalances.sort((a, b) => b.balance - a.balance)

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
            recentTransactions,
            sourceBalances
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}