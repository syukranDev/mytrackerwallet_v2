import React from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { SIDE_MENU_DATA } from '../../utils/data'
import { useContext } from 'react'
import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletCards,
    LuLogOut,
    LuList
} from 'react-icons/lu'

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    const iconMap = {
        'LuLayoutDashboard': LuLayoutDashboard,
        'LuHandCoins': LuHandCoins,
        'LuWalletCards': LuWalletCards,
        'LuList': LuList,
        'LuLogOut': LuLogOut
    }

    const handleMenuClick = (item) => {
        if (item.path === '/logout') {
            clearUser()
            localStorage.removeItem('token')
            navigate('/login')
        } else {
            navigate(item.path)
        }
    }

    const isActive = (path) => {
        if (activeMenu) {
            return activeMenu === path
        }
        return location.pathname === path
    }

    // Separate regular menu items from logout
    const regularMenuItems = SIDE_MENU_DATA.filter(item => item.path !== '/logout')
    const logoutItem = SIDE_MENU_DATA.find(item => item.path === '/logout')
    const LogoutIcon = logoutItem ? iconMap[logoutItem.icon] : null

    return (
        <div className='w-80 h-[calc(100vh-61px)] bg-white border-r border-slate-200/50 p-5 sticky top-[61px] z-20 overflow-y-auto flex flex-col'>
            <div className='flex flex-col items-center gap-3 mt-3 mb-10'>
                { user?.profileImageUrl ? (
                    <img 
                        src={user?.profileImageUrl} 
                        alt="Profile" 
                        className='w-16 h-16 rounded-full object-cover border-2 border-slate-200' 
                    />
                ) : (
                    <div className='w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200'>
                        <FaUser className='w-8 h-8 text-slate-400' />
                    </div>
                )}

                <h5 className='text-base font-medium text-slate-800 text-center'>{user?.fullName ?? 'User'}</h5>
            </div>

            <div className='flex flex-col gap-2 flex-1'>
                {
                    regularMenuItems.map((item, index) => {
                        const IconComponent = iconMap[item.icon]
                        const active = isActive(item.path)
                        
                        return (
                            <button
                                key={`menu_${index}`}
                                onClick={() => handleMenuClick(item)}
                                className={`
                                    w-full flex items-center gap-4 text-[15px] font-medium
                                    transition-all duration-200 ease-in-out
                                    py-3 px-4 rounded-lg mb-1
                                    ${
                                        active 
                                            ? 'text-white bg-primary shadow-md' 
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                                    }
                                `}
                            >
                                {IconComponent && <IconComponent className='text-2xl' />}
                                <span>{item.label}</span>
                            </button>
                        )
                    })
                }
            </div>

            {/* Logout button at the bottom */}
            {logoutItem && (
                <div className='mt-auto pt-4 border-t border-slate-200'>
                    <button
                        onClick={() => handleMenuClick(logoutItem)}
                        className='
                            w-full flex items-center gap-4 text-[15px] font-medium
                            transition-all duration-200 ease-in-out
                            py-3 px-4 rounded-lg
                            text-slate-700 hover:bg-slate-100 hover:text-primary
                        '
                    >
                        {LogoutIcon && <LogoutIcon className='text-2xl' />}
                        <span>{logoutItem.label}</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default SideMenu