import React, { useState } from 'react'
import { LuX, LuPlus, LuTrash2, LuAirplay } from 'react-icons/lu'

const DestinationManagementModal = ({
  isOpen,
  onClose,
  destinations,
  onAddDestination,
  onEditDestination,
  onDeleteDestination
}) => {
  const [destinationFormData, setDestinationFormData] = useState({ name: '' })
  const [editingDestination, setEditingDestination] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!destinationFormData.name.trim()) {
      return
    }

    if (editingDestination) {
      onEditDestination(editingDestination.id, destinationFormData.name.trim())
    } else {
      onAddDestination(destinationFormData.name.trim())
    }
    
    setDestinationFormData({ name: '' })
    setEditingDestination(null)
  }

  const handleEditClick = (destination) => {
    setEditingDestination(destination)
    setDestinationFormData({ name: destination.name })
  }

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      onDeleteDestination(id)
    }
  }

  const handleClose = () => {
    setDestinationFormData({ name: '' })
    setEditingDestination(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Manage Destinations
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        <div className="p-6">
          {/* Add/Edit Destination Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={destinationFormData.name}
                onChange={(e) => setDestinationFormData({ name: e.target.value })}
                placeholder="e.g., Bank A, Investment Bank, Savings"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {editingDestination ? <LuAirplay /> : <LuPlus />}
              </button>
            </div>
          </form>

          {/* Destinations List */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Existing Destinations ({destinations.length})
            </p>
            {destinations.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No destinations yet. Add one above.
              </p>
            ) : (
              destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {dest.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(dest)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <LuAirplay className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(dest.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <LuTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationManagementModal

