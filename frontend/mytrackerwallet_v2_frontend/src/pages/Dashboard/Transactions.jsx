import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPaths'
import { addThousandSeparator } from '../../utils/helper'
import { LuTrendingUp, LuTrendingDown, LuChevronLeft, LuChevronRight } from 'react-icons/lu'

const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const Transactions = () => {
  useUserAuth()

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  })

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATH.TRANSACTIONS.GET_ALL, {
        params: {
          page,
          limit: 10
        }
      })
      
      if (response.data) {
        setTransactions(response.data.transactions || [])
        setPagination(response.data.pagination || pagination)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions(1)
  }, [])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTransactions(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getTransactionType = (transaction) => {
    if (transaction.type) {
      return transaction.type
    }
    return transaction.source ? 'income' : 'expense'
  }

  const getTransactionLabel = (transaction) => {
    const type = getTransactionType(transaction)
    if (type === 'expense') {
      return transaction.category || 'Expense'
    } else {
      return transaction.source || 'Income'
    }
  }

  return (
    <DashboardLayout activeMenu='/transactions'>
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">All Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all your income and expense transactions</p>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <LuTrendingDown className="text-2xl text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No transactions found</p>
              <p className="text-sm text-slate-500 mt-1">Start adding income or expenses to see transactions here</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {transactions.map((transaction) => {
                  const type = getTransactionType(transaction)
                  const isIncome = type === 'income'
                  
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-slate-200"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                          isIncome ? 'bg-slate-100' : 'bg-slate-200'
                        }`}>
                          {isIncome ? (
                            <LuTrendingUp className="text-lg text-slate-600" />
                          ) : (
                            <LuTrendingDown className="text-lg text-slate-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">
                            {getTransactionLabel(transaction)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-slate-500">
                              {formatDateTime(transaction.created_at)}
                            </p>
                            {isIncome && transaction.to && (
                              <>
                                <span className="text-xs text-slate-400">•</span>
                                <p className="text-xs text-slate-600 font-medium">To: {transaction.to}</p>
                              </>
                            )}
                            {!isIncome && transaction.source && (
                              <>
                                <span className="text-xs text-slate-400">•</span>
                                <p className="text-xs text-slate-600 font-medium">From: {transaction.source}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-base font-semibold whitespace-nowrap ${
                          isIncome ? 'text-slate-600' : 'text-slate-700'
                        }`}>
                          {isIncome ? '+' : '-'}{addThousandSeparator(Number(transaction.amount || 0).toFixed(2))}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 gap-4">
                <div className="text-sm text-slate-600">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} transactions
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      title="First page"
                    >
                      First
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LuChevronLeft className="text-lg" />
                      <span>Previous</span>
                    </button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const pages = []
                        const totalPages = pagination.totalPages
                        const currentPage = pagination.currentPage
                        
                        // Show up to 5 page numbers
                        let startPage = Math.max(1, currentPage - 2)
                        let endPage = Math.min(totalPages, startPage + 4)
                        
                        // Adjust if we're near the end
                        if (endPage - startPage < 4) {
                          startPage = Math.max(1, endPage - 4)
                        }
                        
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i)
                        }
                        
                        return pages.map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              pagination.currentPage === pageNum
                                ? 'bg-slate-600 text-white shadow-sm'
                                : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))
                      })()}
                    </div>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                      <LuChevronRight className="text-lg" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      title="Last page"
                    >
                      Last
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Transactions

