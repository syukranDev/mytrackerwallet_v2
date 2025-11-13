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
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Manage Destinations
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                required
              />
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                {editingDestination ? <LuAirplay /> : <LuPlus />}
              </button>
            </div>
          </form>

          {/* Destinations List */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Existing Destinations ({destinations.length})
            </p>
            {destinations.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                No destinations yet. Add one above.
              </p>
            ) : (
              destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {dest.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(dest)}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <LuAirplay className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(dest.id)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
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

