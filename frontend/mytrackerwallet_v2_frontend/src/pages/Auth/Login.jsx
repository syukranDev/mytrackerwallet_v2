import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext.jsx'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const { updateUser } = useContext(UserContext);


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Please enter your email'
    }
    if (!formData.password) {
      newErrors.password = 'Please enter your password'
    }
    
    // Set all errors at once and return early if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({});

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, formData)

      console.log('Login response:', response.data)

      const { token, user } = response.data

      if (token) { 
        localStorage.setItem('token', token)
        updateUser(user)
        navigate('/dashboard')
      } else {
        setErrors({
          generic: 'Login failed: No token received',
        })
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error.response?.status === 401) {
        setErrors({
          generic: error.response.data?.message || 'Invalid email or password',
        })
        return
      }
      
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 'An error occurred during login'
        setErrors({
          generic: errorMessage,
        })
      } else {
        setErrors({
          generic: 'An error occurred during login. Please try again later.',
        })
      }
    }
  }

  return (
    <AuthLayout>
      <div className='w-full max-w-md'>
        <h2 className="text-2xl font-bold text-black mb-1">Login</h2>
        <p className="text-sm text-slate-600 mb-5">
          Welcome back! Please enter your details to login.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 Characters"
                className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>
            )}
          </div>

          {errors.generic && (
            <p className="text-red-500 text-xs mt-0.5">{errors.generic}</p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors uppercase text-sm mt-6"
          >
            LOGIN
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login