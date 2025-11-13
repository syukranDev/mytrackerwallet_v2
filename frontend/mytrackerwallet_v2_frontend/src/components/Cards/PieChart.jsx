import React from 'react'
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { addThousandSeparator } from '../../utils/helper'

const COLORS = ['#475569', '#64748b', '#475569', '#94a3b8', '#cbd5e1']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, payload: item } = payload[0]
    const percentage = item.percentage

    return (
      <div className="rounded-lg bg-white/95 shadow-xl border border-slate-100 px-3 py-2">
        <p className="text-sm font-medium text-slate-700">{name}</p>
        <p className="text-xs text-slate-500">{percentage}% • {addThousandSeparator(value)}</p>
      </div>
    )
  }

  return null
}

const PieChart = ({ value = [] }) => {
  const sanitized = value
    .filter((item) => typeof item?.value === 'number' && !Number.isNaN(item.value))
    .map((item) => ({
      ...item,
      value: Math.max(Number(item.value), 0)
    }))

  const total = sanitized.reduce((acc, item) => acc + item.value, 0)

  const pieData = sanitized.map((item) => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
  }))

  if (sanitized.length === 0 || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-slate-400 text-sm">
        <span>No data to display</span>
        <span className="text-xs">Start tracking income and expenses to see insights.</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative mx-auto h-64 w-full">
        <ResponsiveContainer>
          <RePieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RePieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Balance
          </span>
          <span className="text-lg font-semibold text-slate-800">
            {addThousandSeparator(total)}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {pieData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">{item.name}</p>
              <p className="text-xs text-slate-500">
                {item.percentage}% • {addThousandSeparator(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChart