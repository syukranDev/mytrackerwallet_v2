import React from 'react'
import { LuWallet } from 'react-icons/lu'

const Navbar = () => {
    return (
        <div className='flex gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
            <div className='flex items-center gap-2'>
                <LuWallet className='text-2xl text-green-600' />
                <h2 className='text-xl font-medium text-gray-800'>MyWalletTracker</h2>
            </div>
        </div>
    )
}

export default Navbar