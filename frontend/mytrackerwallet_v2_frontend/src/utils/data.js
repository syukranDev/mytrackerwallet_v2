import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletCards,
    LuLogOut,
    LuList
} from 'react-icons/lu'

export const SIDE_MENU_DATA = [
    {
        id: "01",
        icon: 'LuLayoutDashboard',
        label: 'Dashboard',
        path: '/dashboard'
    },
    {
        id: "02",
        icon: 'LuHandCoins',
        label: 'Income',
        path: '/income'
    },
    {
        id: "03",
        icon: 'LuWalletCards',
        label: 'Expense',
        path: '/expense'
    },
    {
        id: "04",
        icon: 'LuList',
        label: 'Transactions',
        path: '/transactions'
    },
    {
        id: "05",
        icon: 'LuLogOut',
        label: 'Logout',
        path: '/logout'
    }
]

