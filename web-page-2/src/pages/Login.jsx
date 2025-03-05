import React, { useState } from "react";
import { Link } from "../Link";
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import '../css/register.css';

const Login = () => {
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // UI State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Input Change Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    
    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "PokéEmail is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid PokéEmail";
    }
    
    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        // Simulate server submission
        console.log('Form Data:', formData);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success
        setFormSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          // TODO: Replace with actual navigation logic
          console.log('Redirecting to trainer dashboard...');
        }, 2000);
        
      } catch (error) {
        console.error("Login Error:", error);
        setErrors({ 
          submit: "Incorrect credentials. Please check your PokéEmail and password." 
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  // Social Login Handlers
  const handleSocialLogin = (platform) => {
    // Centralized social login handler
    switch(platform) {
      case 'google':
        window.location.href = '/auth/google';
        break;
      case 'facebook':
        window.location.href = '/auth/facebook';
        break;
      case 'twitter':
        window.location.href = '/auth/twitter';
        break;
      default:
        console.error('Unknown platform');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-500 flex flex-col items-center justify-center p-4">
      {/* Pokemon League Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full relative">
          {/* Pokeball Design */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-t-full overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-px"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-b-full border-t border-black">
            <div className="absolute top-0 left-0 w-full h-px bg-black"></div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-gray-700 z-10"></div>
          
          <div className="absolute inset-0 border-4 border-black rounded-full pointer-events-none"></div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2 text-shadow">Pokemon League</h1>
        <p className="text-white text-lg text-shadow">Official platform for pokemon trainers</p>
      </div>
      
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-102">
          {/* Colorful Top Bar */}
          <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
          
          <div className="p-8">
            {/* Success Message */}
            {formSuccess && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm font-medium">Welcome back, Trainer!</p>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm font-medium">{errors.submit}</p>
                </div>
              </div>
            )}
            
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Trainer Access</h2>
              <p className="text-gray-600 mt-2">Enter your credentials</p>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  PokéEmail
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`py-3 pl-10 w-full border ${
                      errors.email 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-xl shadow-sm`}
                    placeholder="ash.ketchum@pokemon.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`py-3 pl-10 w-full border ${
                      errors.password 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-xl shadow-sm`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                    isSubmitting 
                      ? 'bg-gray-400' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Logging in</span>
                    </>
                  ) : (
                    <span>Start your adventure</span>
                  )}
                </button>
              </div>
            </form>
            
            {/* Social Login Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <button 
                    onClick={() => handleSocialLogin('google')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-300 ease-in-out"
                  >
                    <span className="sr-only">Login with Google</span>
                    <FaGoogle className="w-5 h-5 text-red-500" />
                  </button>
                </div>
                <div>
                  <button 
                    onClick={() => handleSocialLogin('facebook')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-300 ease-in-out"
                  >
                    <span className="sr-only">Login with Facebook</span>
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
                <div>
                  <button 
                    onClick={() => handleSocialLogin('twitter')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-300 ease-in-out"
                  >
                    <span className="sr-only">Login with Twitter</span>
                    <FaTwitter className="w-5 h-5 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <p className="text-sm text-gray-600">
              No account? 
              <Link to="/register" className="ml-1 font-medium text-red-600 hover:text-red-500">
                Sign up
              </Link>
            </p>
            
            <div className="flex space-x-4">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer Text */}
        <div className="text-center mt-6 text-sm text-white">
          <p>© {new Date().getFullYear()} Pokemon League. All rights reserved.</p>
          <p className="mt-1">Designed for trainers from all regions.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;