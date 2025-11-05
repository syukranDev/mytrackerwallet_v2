import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import { FaEye, FaEyeSlash, FaUser, FaUpload } from 'react-icons/fa'

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [profilePicture, setProfilePicture] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicture(file)
      // Clear error if exists
      if (errors.profilePicture) {
        setErrors(prev => ({
          ...prev,
          profilePicture: ''
        }))
      }
    }
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your name'
    }
    if (!formData.email) {
      newErrors.email = 'Please enter your email'
    }
    if (!formData.password) {
      newErrors.password = 'Please enter your password'
    }
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      // Handle signup logic here
      console.log('Sign Up:', formData, profilePicture)
    }
  }

  return (
    <AuthLayout>
      <div className='w-full max-w-md'>
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-black mb-1">Create an Account</h2>
            <p className="text-sm text-slate-600">
              Join us today by entering your details below.
            </p>
          </div>
          
          {/* Profile Picture Upload */}
          <div className="relative">
            <div 
              onClick={handleProfilePictureClick}
              className="w-16 h-16 rounded-full border-2 border-purple-600 bg-purple-100 flex items-center justify-center cursor-pointer hover:bg-purple-200 transition-colors relative overflow-hidden"
            >
              {profilePicture ? (
                <img 
                  src={URL.createObjectURL(profilePicture)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-purple-600 text-2xl" />
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white">
                <FaUpload className="text-white text-xs" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-0.5">{errors.fullName}</p>
            )}
          </div>

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

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors uppercase text-sm mt-6"
          >
            SIGN UP
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp