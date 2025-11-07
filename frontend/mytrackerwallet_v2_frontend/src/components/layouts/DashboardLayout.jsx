import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({children, activeMenu}) => {
    const { user } = useContext(UserContext)

    return (
        <div className="min-h-screen">
            <Navbar />

            { user && (
                <div className="flex">
                    <SideMenu activeMenu={activeMenu}/>
                    <div className="grow mx-5">{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout