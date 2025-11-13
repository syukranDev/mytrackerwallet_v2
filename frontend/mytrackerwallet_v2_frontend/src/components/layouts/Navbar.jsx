import React from 'react'
import { LuWallet } from 'react-icons/lu'

const Navbar = () => {
    return (
        <div className='flex gap-5 bg-white border-b border-slate-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
            <div className='flex items-center gap-2'>
                <LuWallet className='text-2xl text-slate-600' />
                <h2 className='text-lg font-medium text-slate-800'>MyWalletTracker</h2>
                {/* <h2 className="text-lg font-medium text-black mb-2">MyWalletTracker</h2> */}
        
            </div>
        </div>
    )
}

export default Navbar