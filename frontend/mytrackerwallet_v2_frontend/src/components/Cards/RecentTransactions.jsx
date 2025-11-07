import React from 'react'
import { addThousandSeparator } from '../../utils/helper'
import { LuArrowRight, LuTrendingUp, LuTrendingDown } from 'react-icons/lu'

const RecentTransactions = ({ transactions = [], seeMore }) => {
  const getTransactionType = (transaction) => {
    // If it has 'source', it's an income; if it has 'category', it's an expense
    return transaction.source ? 'income' : 'expense'
  }

  const getTransactionLabel = (transaction) => {
    return transaction.source || transaction.category || 'Transaction'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-1 md:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        {seeMore && (
          <button
            onClick={seeMore}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
          >
            See All
            <LuArrowRight className="text-base" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No recent transactions</p>
          </div>
        ) : (
          transactions.map((transaction, index) => {
            const type = getTransactionType(transaction)
            const isIncome = type === 'income'
            
            return (
              <div
                key={transaction.id || index}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isIncome ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isIncome ? (
                      <LuTrendingUp className={`text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`} />
                    ) : (
                      <LuTrendingDown className="text-lg text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {getTransactionLabel(transaction)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-semibold ${
                    isIncome ? 'text-green-600 bg-green-500/10 px-2 py-1 rounded-md' : 'text-red-600 bg-red-500/10 px-2 py-1 rounded-md'
                  }`}>
                    {isIncome ? '+' : '-'}{addThousandSeparator(transaction.amount || 0)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default RecentTransactions