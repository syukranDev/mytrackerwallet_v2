import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FaChartLine } from 'react-icons/fa'

const AuthLayout = ({children}) => {
  const chartData = [
    { month: 'Jan', income: 120, expense: 80 },
    { month: 'Feb', income: 90, expense: 60 },
    { month: 'Mar', income: 140, expense: 100 },
    { month: 'Apr', income: 160, expense: 120 },
    { month: 'May', income: 200, expense: 150 },
    { month: 'Jun', income: 180, expense: 130 },
    { month: 'Jul', income: 220, expense: 170 },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          <p className="text-sm text-slate-600">Income ${payload[1]?.value || 0}</p>
          <p className="text-sm text-slate-600">Expense ${payload[0]?.value || 0}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Section - Form */}
      <div className="w-full md:w-[60%] lg:w-[55%] h-screen px-8 md:px-12 py-6 bg-white flex flex-col">
        <h2 className="text-lg font-medium text-black mb-2">MyWalletTracker</h2>
        <div className="flex-1 flex items-center">
          {children}
        </div>
      </div>

      {/* Right Section - Dashboard Preview */}
      <div className="hidden md:flex md:w-[40%] lg:w-[45%] h-screen bg-slate-50 p-6 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute w-48 h-48 rounded-[40px] bg-slate-700 -top-7 -left-5"></div>
        <div className="absolute w-48 h-56 rounded-[40px] bg-slate-700 -bottom-7 -right-5"></div>

        {/* Dashboard Content */}
        <div className="w-full flex flex-col gap-4 z-10 relative h-full">
          {/* Income/Expenses Card */}
          <div className="bg-white rounded-xl p-4 shadow-md shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                <FaChartLine className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-slate-600 text-xs">Track Your Income & Expenses</p>
                <p className="text-xl font-bold text-slate-800 mt-0.5">RM 430,000</p>
              </div>
            </div>
          </div>

          {/* Transactions Chart Card */}
          <div className="bg-white rounded-xl p-4 shadow-md flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-800">All Transactions</h3>
                <p className="text-xs text-slate-500 mt-0.5">2nd Jan to 21st Dec</p>
              </div>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                View More
              </button>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fontSize: 11 }}
                    domain={[0, 400]}
                    ticks={[0, 50, 120, 160, 230, 400]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="expense" stackId="a" fill="#64748b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="income" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout