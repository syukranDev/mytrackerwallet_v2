import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPaths'
import { addThousandSeparator } from '../../utils/helper'
import InfoCard from '../../components/Cards/InfoCard'
import { LuTrendingDown, LuDollarSign, LuDownload, LuTrash2, LuPlus, LuCalendar } from 'react-icons/lu'
import EmojiPicker from 'emoji-picker-react'
import toast from 'react-hot-toast'

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

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

const Expense = () => {
  useUserAuth()

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [formData, setFormData] = useState({
    icon: '💸',
    amount: '',
    category: '',
    source: ''
  })

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATH.EXPENSE.GET_EXPENSE_DATA)
      
      if (response.data && response.data.expenses) {
        // Sort by created_at descending (newest first)
        const sortedExpenses = [...response.data.expenses].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at)
        })
        setExpenses(sortedExpenses)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all income destinations (used as sources for expenses)
  const fetchDestinations = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.DESTINATIONS.GET_ALL)
      if (response.data && response.data.destinations) {
        setDestinations(response.data.destinations)
      }
    } catch (error) {
      console.error('Error fetching destinations:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch destinations')
    }
  }

  useEffect(() => {
    fetchExpenses()
    fetchDestinations()
  }, [])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-wrapper')) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  // Calculate statistics
  const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const expenseCount = expenses.length
  const averageExpense = expenseCount > 0 ? totalExpense / expenseCount : 0

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle emoji selection
  const handleEmojiClick = (emojiData) => {
    setFormData(prev => ({
      ...prev,
      icon: emojiData.emoji
    }))
    setShowEmojiPicker(false)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.amount || !formData.category || !formData.source) {
      toast.error('Please fill in all fields including source')
      return
    }

    if (Number(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    try {
      setSubmitting(true)
      const response = await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, {
        icon: formData.icon,
        amount: Number(formData.amount),
        category: formData.category,
        source: formData.source
      })

      if (response.data) {
        toast.success('Expense added successfully!')
        setFormData({
          icon: '💸',
          amount: '',
          category: '',
          source: ''
        })
        fetchExpenses()
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error(error.response?.data?.message || 'Failed to add expense')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete expense
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      const response = await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(id))
      
      if (response.data) {
        toast.success('Expense deleted successfully!')
        fetchExpenses()
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error(error.response?.data?.message || 'Failed to delete expense')
    }
  }

  // Handle download Excel
  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXPENSE_EXCEL, {
        responseType: 'blob'
      })
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Excel file downloaded successfully!')
    } catch (error) {
      console.error('Error downloading Excel:', error)
      toast.error(error.response?.data?.message || 'Failed to download Excel file')
    }
  }

  return (
    <DashboardLayout activeMenu='/expense'>
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your expenses</p>
          </div>
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
            disabled={expenseCount === 0}
          >
            <LuDownload className="text-lg" />
            <span>Download Excel</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InfoCard
            icon={<LuTrendingDown />}
            label="Total Expense"
            value={addThousandSeparator(totalExpense.toFixed(2))}
            color="bg-red-500"
          />
          <InfoCard
            icon={<LuDollarSign />}
            label="Total Transactions"
            value={expenseCount}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuCalendar />}
            label="Average Expense"
            value={addThousandSeparator(averageExpense.toFixed(2))}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Expense Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Expense</h2>
            {destinations.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  No income destinations found
                </p>
                <p className="text-xs text-yellow-700">
                  Please add at least one destination in the <strong>Income</strong> page before adding expenses. Expenses must use a source from your income destinations.
                </p>
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="space-y-4" style={{ opacity: destinations.length === 0 ? 0.5 : 1, pointerEvents: destinations.length === 0 ? 'none' : 'auto' }}>
              {/* Icon Picker */}
              <div className="relative emoji-picker-wrapper">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-16 h-16 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-3xl transition-colors duration-200 border-2 border-gray-200"
                  >
                    {formData.icon}
                  </button>
                  <p className="text-sm text-gray-500">Click to change icon</p>
                </div>
                {showEmojiPicker && (
                  <div className="absolute z-10 mt-2 emoji-picker-wrapper">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      height={350}
                      width={350}
                    />
                  </div>
                )}
              </div>

              {/* Category Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Food, Transport, Shopping, Bills"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Source Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">(from Income destinations)</span>
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                  disabled={destinations.length === 0}
                >
                  <option value="">Select source</option>
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.name}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || destinations.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuPlus className="text-lg" />
                <span>{submitting ? 'Adding...' : 'Add Expense'}</span>
              </button>
            </form>
          </div>

          {/* Expense List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Expense History ({expenseCount})
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <LuTrendingDown className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No expense records yet</p>
                <p className="text-sm text-gray-400 mt-1">Add your first expense to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-2xl shrink-0">
                        {expense.icon || '💸'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {expense.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {formatDateTime(expense.created_at)}
                          </p>
                          {expense.source && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-red-600 font-medium">
                                From: {expense.source}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-semibold text-red-600 whitespace-nowrap">
                        -{addThousandSeparator(Number(expense.amount || 0).toFixed(2))}
                      </span>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete expense"
                      >
                        <LuTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Expense