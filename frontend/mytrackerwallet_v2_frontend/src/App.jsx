import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import Transactions from './pages/Dashboard/Transactions'

import UserProvider from './context/userContext.jsx'

const App = () => {
  return (
    <UserProvider>
      <div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Router>
          <Routes>
            <Route path='/' element={<Root />}/>
            <Route path='/login'  element={<Login />}/>
            <Route path='/signUp'  element={<SignUp />}/>
            <Route path='/dashboard' element={<Home />}/>
            <Route path='/income' element={<Income />}/>
            <Route path='/expense' element={<Expense />}/>
            <Route path='/transactions' element={<Transactions />}/>
          </Routes>
        </Router>
      </div>
    </UserProvider>
  )
}

export default App

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token')

  return isAuthenticated ? (
    <Navigate to={'/dashboard'}/>
  ) : (
    <Navigate to={'/login'}/>
  )
}