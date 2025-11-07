import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'

const Home = () => {
  useUserAuth()

  return (
    <DashboardLayout>
      <div className="my-5 mx-auto">
        Home fuckjer
      </div>
    </DashboardLayout>
  )
}

export default Home