import React from 'react'

const InfoCard = ({icon, label, color, value}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color || 'bg-primary'} rounded-lg flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-800">
          {value || '0'}
        </p>
      </div>
    </div>
  )
}

export default InfoCard