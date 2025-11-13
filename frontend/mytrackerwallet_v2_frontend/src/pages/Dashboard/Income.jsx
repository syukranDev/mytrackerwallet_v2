import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPaths'
import { addThousandSeparator } from '../../utils/helper'
import InfoCard from '../../components/Cards/InfoCard'
import { LuTrendingUp, LuDollarSign, LuDownload, LuTrash2, LuPlus, LuCalendar, LuSettings } from 'react-icons/lu'
import EmojiPicker from 'emoji-picker-react'
import toast from 'react-hot-toast'
import DestinationManagementModal from '../../components/Modals/DestinationManagementModal'

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

const Income = () => {
  useUserAuth()

  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [showDestinationModal, setShowDestinationModal] = useState(false)
  const [formData, setFormData] = useState({
    icon: '💰',
    amount: '',
    source: '',
    to: ''
  })

  // Fetch all incomes
  const fetchIncomes = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATH.INCOME.GET_INCOME_DATA)
      
      if (response.data && response.data.incomes) {
        // Sort by created_at descending (newest first)
        const sortedIncomes = [...response.data.incomes].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at)
        })
        setIncomes(sortedIncomes)
      }
    } catch (error) {
      console.error('Error fetching incomes:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch incomes')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all destinations
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
    fetchIncomes()
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
  const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount || 0), 0)
  const incomeCount = incomes.length
  const averageIncome = incomeCount > 0 ? totalIncome / incomeCount : 0

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

    if (!formData.amount || !formData.source) {
      toast.error('Please fill in all fields')
      return
    }

    if (Number(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    try {
      setSubmitting(true)
      const response = await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, {
        icon: formData.icon,
        amount: Number(formData.amount),
        source: formData.source,
        to: formData.to || null
      })

      if (response.data) {
        toast.success('Income added successfully!')
        setFormData({
          icon: '💰',
          amount: '',
          source: '',
          to: ''
        })
        fetchIncomes()
      }
    } catch (error) {
      console.error('Error adding income:', error)
      toast.error(error.response?.data?.message || 'Failed to add income')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete income
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) {
      return
    }

    try {
      const response = await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(id))
      
      if (response.data) {
        toast.success('Income deleted successfully!')
        fetchIncomes()
      }
    } catch (error) {
      console.error('Error deleting income:', error)
      toast.error(error.response?.data?.message || 'Failed to delete income')
    }
  }

  // Handle destination management
  const handleAddDestination = async (name) => {
    try {
      await axiosInstance.post(API_PATH.INCOME.DESTINATIONS.ADD, {
        name: name.trim()
      })
      toast.success('Destination added successfully!')
      fetchDestinations()
    } catch (error) {
      console.error('Error adding destination:', error)
      toast.error(error.response?.data?.message || 'Failed to add destination')
    }
  }

  const handleEditDestination = async (id, name) => {
    try {
      await axiosInstance.put(API_PATH.INCOME.DESTINATIONS.UPDATE(id), {
        name: name.trim()
      })
      toast.success('Destination updated successfully!')
      fetchDestinations()
    } catch (error) {
      console.error('Error updating destination:', error)
      toast.error(error.response?.data?.message || 'Failed to update destination')
    }
  }

  const handleDeleteDestination = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.INCOME.DESTINATIONS.DELETE(id))
      toast.success('Destination deleted successfully!')
      fetchDestinations()
      // Clear form if deleted destination was selected
      if (formData.to === destinations.find(d => d.id === id)?.name) {
        setFormData(prev => ({ ...prev, to: '' }))
      }
    } catch (error) {
      console.error('Error deleting destination:', error)
      toast.error(error.response?.data?.message || 'Failed to delete destination')
    }
  }

  const handleCloseDestinationModal = () => {
    setShowDestinationModal(false)
  }

  // Handle download Excel
  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_INCOME_EXCEL, {
        responseType: 'blob'
      })
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `incomes_${new Date().toISOString().split('T')[0]}.xlsx`)
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
    <DashboardLayout activeMenu='/income'>
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Income Management</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your income sources</p>
          </div>
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
            disabled={incomeCount === 0}
          >
            <LuDownload className="text-lg" />
            <span>Download Excel</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InfoCard
            icon={<LuTrendingUp />}
            label="Total Income"
            value={addThousandSeparator(totalIncome.toFixed(2))}
            color="bg-green-500"
          />
          <InfoCard
            icon={<LuDollarSign />}
            label="Total Transactions"
            value={incomeCount}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuCalendar />}
            label="Average Income"
            value={addThousandSeparator(averageIncome.toFixed(2))}
            color="bg-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Income Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Income</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Source Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="e.g., Salary, Freelance, Investment"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* To (Destination) Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    To (Destination)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDestinationModal(true)}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    <LuSettings className="text-sm cursor-pointer" />
                    <span className='cursor-pointer'>Manage</span>
                  </button>
                </div>
                <select
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">Select destination (optional)</option>
                  {destinations.map((dest) => (
                    <option key={dest.id} value={dest.name}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuPlus className="text-lg" />
                <span>{submitting ? 'Adding...' : 'Add Income'}</span>
              </button>
            </form>
          </div>

          {/* Income List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Income History ({incomeCount})
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : incomes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <LuTrendingUp className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No income records yet</p>
                <p className="text-sm text-gray-400 mt-1">Add your first income to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {incomes.map((income) => (
                  <div
                    key={income.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl shrink-0">
                        {income.icon || '💰'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {income.source}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {formatDateTime(income.created_at)}
                          </p>
                          {income.to && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-green-600 font-medium">
                                To: {income.to}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-semibold text-green-600 whitespace-nowrap">
                        +{addThousandSeparator(Number(income.amount || 0).toFixed(2))}
                      </span>
                      <button
                        onClick={() => handleDelete(income.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete income"
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

      {/* Destination Management Modal */}
      <DestinationManagementModal
        isOpen={showDestinationModal}
        onClose={handleCloseDestinationModal}
        destinations={destinations}
        onAddDestination={handleAddDestination}
        onEditDestination={handleEditDestination}
        onDeleteDestination={handleDeleteDestination}
      />
    </DashboardLayout>
  )
}

export default Income
