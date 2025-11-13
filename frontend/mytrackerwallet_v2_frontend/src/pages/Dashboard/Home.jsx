import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPaths'
import InfoCard from '../../components/Cards/InfoCard'
import { addThousandSeparator } from '../../utils/helper'
import { LuTrendingUp, LuTrendingDown, LuWallet } from 'react-icons/lu'
import RecentTransactions from '../../components/Cards/RecentTransactions'
import PieChart from '../../components/Cards/PieChart'

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const Home = () => {
  useUserAuth()
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATH.DASHBOARD.GET_DASHBOARD_DATA)
      
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const totalBalance = Number(dashboardData?.totalBalance || 0)
  const totalIncome = Number(dashboardData?.totalIncome || 0)
  const totalExpense = Number(dashboardData?.totalExpense || 0)

  const expenseInsights = dashboardData?.last30DaysExpenseTransactions
  const incomeInsights = dashboardData?.last60DaysIncome

  const topExpenseCategories = expenseInsights?.topCategories || []
  const expenseTotal30Days = Number(expenseInsights?.total || 0)
  const expenseCount30Days = Number(expenseInsights?.count || 0)
  const avgExpense30Days = Number(expenseInsights?.average || 0)

  const incomeTotal60Days = Number(incomeInsights?.total || 0)
  const incomeCount60Days = Number(incomeInsights?.count || 0)
  const avgIncome60Days = Number(incomeInsights?.average || 0)
  const latestIncome = incomeInsights?.latest

  return (
    <DashboardLayout activeMenu='/dashboard'>
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<LuWallet />}
            label="Total Balance"
            value={addThousandSeparator(totalBalance)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuTrendingUp />}
            label="Total Income"
            value={addThousandSeparator(totalIncome)}
            color="bg-slate-500"
          />
          <InfoCard
            icon={<LuTrendingDown />}
            label="Total Expense"
            value={addThousandSeparator(totalExpense)}
            color="bg-slate-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            seeMore={() => navigate('/transactions')}
          />
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 col-span-1 md:col-span-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Finance Overview</h3>
                <p className="text-xs text-slate-500">Income vs Expense split</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                Live
              </span>
            </div>

            <div className="flex-1">
              <PieChart 
                value={[
                  { name: 'Income', value: totalIncome },
                  { name: 'Expense', value: totalExpense },
                  { name: 'Balance', value: totalBalance },
                ]}
                balance={totalBalance}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 col-span-1 md:col-span-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Expense Breakdown</h3>
                <p className="text-xs text-slate-500">Top categories (30 days)</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-600/10 px-3 py-1 text-[11px] font-medium text-slate-600">
                {expenseCount30Days} txns
              </span>
            </div>

            <div className="space-y-4">
              {topExpenseCategories.length > 0 ? (
                topExpenseCategories.map(({ category, amount, percentage }) => (
                  <div key={category} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-600/10 text-red-600 flex items-center justify-center text-sm font-semibold">
                      {category.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">{category}</p>
                        <span className="text-sm font-medium text-slate-500">{percentage}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-slate-600"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      {addThousandSeparator(amount.toFixed(2))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-400">
                  No expense activity recorded in the last 30 days.
                </div>
              )}
            </div>

            {expenseTotal30Days > 0 && (
              <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="font-medium text-slate-700">Average spend</p>
                <p>
                  {addThousandSeparator(avgExpense30Days.toFixed(2))} per transaction
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 col-span-1 md:col-span-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Income Momentum</h3>
                <p className="text-xs text-slate-500">Last 60 days inflow</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-3 py-1 text-[11px] font-medium text-slate-600">
                {incomeCount60Days} deposits
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-500/10 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-green-700">Total Inflow</div>
                <div className="text-base font-semibold text-green-700">
                  {addThousandSeparator(incomeTotal60Days.toFixed(2))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm text-slate-600">
                <p className="font-medium text-slate-700">Average per transaction</p>
                <p>{addThousandSeparator(avgIncome60Days.toFixed(2))}</p>
              </div>

              {latestIncome && (
                <div className="rounded-lg border border-slate-100 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Most recent deposit</p>
                  <div className="mt-2 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{latestIncome.source || 'Income'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500">{formatDate(latestIncome.created_at)}</p>
                        {latestIncome.to && (
                          <>
                            <span className="text-xs text-slate-400">•</span>
                            <p className="text-xs text-slate-600 font-medium">To: {latestIncome.to}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-600">
                      +{addThousandSeparator(Number(latestIncome.amount || 0).toFixed(2))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 col-span-1 md:col-span-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Source Balance</h3>
                <p className="text-xs text-slate-500">Balance per income source</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                {dashboardData?.sourceBalances?.length || 0} sources
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
              {dashboardData?.sourceBalances && dashboardData.sourceBalances.length > 0 ? (
                dashboardData.sourceBalances.map(({ source, balance }) => (
                  <div key={source} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{source}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`text-base font-semibold px-3 py-1 rounded-md ${
                        balance >= 0 
                          ? 'text-slate-600 bg-slate-500/10' 
                          : 'text-red-600 bg-red-50'
                      }`}>
                        {balance >= 0 ? '+' : ''}{addThousandSeparator(balance.toFixed(2))}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-400">
                  No source data available. Add income sources to see balances.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home