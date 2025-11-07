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

    console.log(dashboardData)
  }, [])

  return (
    <DashboardLayout activeMenu='/dashboard'>
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<LuWallet />}
            label="Total Balance"
            value={addThousandSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuTrendingUp />}
            label="Total Income"
            value={addThousandSeparator(dashboardData?.totalIncome || 0)}
            color="bg-green-500"
          />
          <InfoCard
            icon={<LuTrendingDown />}
            label="Total Expense"
            value={addThousandSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            seeMore={() => navigate('/expense')}
          />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-1 md:col-span-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Finance Overview</h3>
                <p className="text-xs text-gray-500">Income vs Expense split</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                Live
              </span>
            </div>

            <div className="flex-1">
              <PieChart 
                value={[
                  { name: 'Income', value: dashboardData?.totalIncome },
                  { name: 'Expense', value: dashboardData?.totalExpense },
                  { name: 'Balance', value: dashboardData?.totalBalance },
                ]}
              />
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-1 md:col-span-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Finance Overview</h3>
                <p className="text-xs text-gray-500">Income vs Expense split</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                Live
              </span>
            </div>

            <div className="flex-1">
              <PieChart 
                value={[
                  { name: 'Income', value: dashboardData?.totalIncome },
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-1 md:col-span-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Finance Overview</h3>
                {/* <p className="text-xs text-gray-500">Income vs Expense split</p> */}
              </div>
            </div>

            <div className="flex-1">
              <p>TBA</p>
              {/* <PieChart 
                value={[
                  { name: 'Income', value: dashboardData?.totalIncome },
                  { name: 'Expense', value: dashboardData?.totalExpense },
                  { name: 'Balance', value: dashboardData?.totalBalance },
                ]}
              /> */}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-1 md:col-span-1 flex flex-col">
            <div className="flex-1">
              <p>TBA</p>
              {/* <PieChart 
                value={[
                  { name: 'Income', value: dashboardData?.totalIncome },
                  { name: 'Expense', value: dashboardData?.totalExpense },
                  { name: 'Balance', value: dashboardData?.totalBalance },
                ]}
              /> */}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home