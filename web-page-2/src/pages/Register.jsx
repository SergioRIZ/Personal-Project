import { Link } from '../Link.jsx'
import React, {useState} from "react";
import '../css/register.css'


export default function Register() {
  const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Existing form logic remains the same...
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
          ...prevData,
          [name]: value
      }));
      
      if (errors[name]) {
          setErrors(prevErrors => ({
              ...prevErrors,
              [name]: null
          }));
      }
  };
  
  const validateForm = () => {
      const newErrors = {};
      
      if (!formData.username.trim()) {
          newErrors.username = "El nombre de entrenador es obligatorio";
      } else if (formData.username.length < 3) {
          newErrors.username = "El nombre debe tener al menos 3 caracteres";
      }
      
      if (!formData.email.trim()) {
          newErrors.email = "El PokéEmail es obligatorio";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = "Ingresa un PokéEmail válido";
      }
      
      if (!formData.password) {
          newErrors.password = "La contraseña es obligatoria";
      } else if (formData.password.length < 6) {
          newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
      
      if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      if (validateForm()) {
        
          try {
              
              
              await new Promise(resolve => setTimeout(resolve, 800));
              
              setFormSuccess(true);

              setTimeout(() => {
                  setFormData({
                      username: '',
                      email: '',
                      password: '',
                      confirmPassword: ''
                  });
                  setFormSuccess(false);
              }, 2000);
              
          } catch (error) {
              console.error("Error al registrar:", error);
              setErrors({ submit: "Error al crear entrenador. Inténtalo nuevamente." });
          }
      }
      
      setIsSubmitting(false);
  };


  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/pokemon-background.svg')] p-4 bg-no-repeat bg-cover bg-center">
          {/* Pokémon-themed Background Elements */}
          
          {/* Existing form content remains the same, just wrapped in relative positioning */}
          <div className="relative">
              <div className="mb-6 text-center">
                  <h1 className="text-4xl font-bold text-red-600 mb-2">Pokemon Center</h1>
                  <p className="text-gray-600">Log-In to start your adventure!</p>
              </div>
              
              <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border-4 space-y-6 relative overflow-hidden">
                  {/* Existing form background and content remains the same */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                      <div className="h-2/3"></div>
                      <div className="h-4"></div>
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-black">
                          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-black"></div>
                      </div>
                  </div>
                  
                                  <div className="relative bg-white bg-opacity-90 p-6 rounded-lg">
                                      <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Become a pokemon master!</h2>
                                      
                                      {formSuccess && (
                                          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                              Congratulations! Your trainer account has been created.
                                          </div>
                                      )}
                                      
                                      {errors.submit && (
                                          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                              {errors.submit}
                                          </div>
                                      )}

                                      <div className="space-y-4">
                                          <div className="flex flex-col">
                                              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                                                  Trainer Name
                                              </label>
                                              <input 
                                                  type="text" 
                                                  id="username"
                                                  name="username" 
                                                  value={formData.username} 
                                                  onChange={handleChange}
                                                  className={`px-4 py-2 border-2 ${errors.username ? 'border-red-500' : 'border-yellow-400'} rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all`}
                                                  placeholder="Ash Ketchum" 
                                              />
                                              {errors.username && (
                                                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                              )}
                                          </div>
                                          
                                          <div className="flex flex-col">
                                              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                                  PokeMail
                                              </label>
                                              <input 
                                                  type="email" 
                                                  id="email"
                                                  name="email" 
                                                  value={formData.email} 
                                                  onChange={handleChange}
                                                  className={`px-4 py-2 border-2 ${errors.email ? 'border-red-500' : 'border-yellow-400'} rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all`}
                                                  placeholder="entrenador@pokemon.com" 
                                              />
                                              {errors.email && (
                                                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                              )}
                                          </div>
                                          
                                          <div className="flex flex-col">
                                              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                                  Password
                                              </label>
                                              <input 
                                                  type="password" 
                                                  id="password"
                                                  name="password" 
                                                  value={formData.password} 
                                                  onChange={handleChange}
                                                  className={`px-4 py-2 border-2 ${errors.password ? 'border-red-500' : 'border-yellow-400'} rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all`}
                                                  placeholder="••••••••" 
                                              />
                                              {errors.password && (
                                                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                              )}
                                          </div>
                                          
                                          <div className="flex flex-col">
                                              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                                                  Confirm password
                                              </label>
                                              <input 
                                                  type="password"
                                                  id="confirmPassword" 
                                                  name="confirmPassword" 
                                                  value={formData.confirmPassword} 
                                                  onChange={handleChange}
                                                  className={`px-4 py-2 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-yellow-400'} rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all`}
                                                  placeholder="••••••••" 
                                              />
                                              {errors.confirmPassword && (
                                                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                              )}
                                          </div>
                                          
                                          <div className="pt-2">
                                              <Link
                                                  type="submit"
                                                  disabled={isSubmitting}
                                                  className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-bold flex items-center justify-center`}
                                                  to="/team-builder"
                                             >
                                                  
                                                {isSubmitting ? (
                                                    
                                                      <>
                                                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                          </svg>
                                                          <span>Processing...</span>
                                                          
                                                      </>
                                                  ) : (
                                                      <span>Create account</span>
                                                  )}
                                              </Link>
                                          </div>
                                      </div>
                                  </div>
                              </form>
                              
                  <p className="relative z-10 text-center text-sm text-gray-700 mt-4 bg-yellow-100 border-2 border-yellow-400 py-3 px-4 rounded-xl shadow-sm">
                    ¿Already an account? <Link to="/login" className="text-red-600 font-bold hover:text-red-700 transition-colors">
                        ¡Start your adventure! 
                        <span className="ml-1 inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </Link>
                </p>

<div className="max-w-md w-full mt-4 flex space-x-4">
    <Link 
        to="/" 
        className="flex-1 px-4 py-3 text-red-600 hover:text-white hover:bg-red-600 font-bold rounded-xl border-2 border-red-600 transition-all duration-300 flex items-center justify-center group"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        HOME
    </Link>
</div>
          </div>
      </div>
  );
}