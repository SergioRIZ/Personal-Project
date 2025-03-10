import React, { useState } from "react";
import { Link } from "../../Link";
import './css/register.css';

export default function Login() {
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Manejo de cambios en los inputs
  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prevData => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value
      }));
      
      // Limpia el error específico cuando el usuario empieza a escribir
      if (errors[name]) {
          setErrors(prevErrors => ({
              ...prevErrors,
              [name]: null
          }));
      }
  };
  
  // Validación del formulario
  const validateForm = () => {
      const newErrors = {};
      
      // Validar email
      if (!formData.email.trim()) {
          newErrors.email = "El PokéEmail es obligatorio";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = "Ingresa un PokéEmail válido";
      }
      
      // Validar contraseña
      if (!formData.password) {
          newErrors.password = "La contraseña es obligatoria";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };
  
  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      if (validateForm()) {
          try {
              // Simular envío al servidor (aquí iría la lógica de API)
              console.log('Datos del formulario:', formData);
              
              // Simular retraso de red
              await new Promise(resolve => setTimeout(resolve, 800));
              
              // Mostrar éxito
              setFormSuccess(true);
              
              // Redireccionar después de 2 segundos
              setTimeout(() => {
                  console.log('Redireccionando al panel de entrenador...');
                  // Aquí iría la redirección o acción post-login
              }, 2000);
              
          } catch (error) {
              console.error("Error al iniciar sesión:", error);
              setErrors({ submit: "Credenciales incorrectas. Verifica tu PokéEmail y contraseña." });
              setIsSubmitting(false);
          }
      } else {
          setIsSubmitting(false);
      }
  };

  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/pokemon-background.svg')] p-4 bg-no-repeat bg-cover bg-center">
          {/* Header con logotipo */}
          <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full relative">
    {/* Red top half */}
    <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-t-full overflow-hidden">
    </div>
    {/* White bottom half */}
    <div className="absolute bottom-0.5 left-0 w-full h-1/2 bg-white rounded-b-full border-t border-black">
        <div className="absolute top-0 left-0 w-full h-1/8 bg-black"></div>
    </div>
    
    {/* Center button */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-4xl border-6 border-gray-700 z-10"></div>
    
    {/* Black border */}
    <div className="absolute inset-0 border-6 border-black rounded-full pointer-events-none"></div>
</div>
              <h1 className="text-5xl font-bold text-red-600 mb-2 text-shadow">Liga Pokémon</h1>
              <p className="text-black text-lg text-shadow">Plataforma oficial para entrenadores</p>
          </div>
          
          <div className="max-w-md w-full mx-auto">
              {/* Tarjeta principal */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-102">
                  {/* Barra superior colorida */}
                  <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
                  
                  {/* Área de contenido */}
                  <div className="p-8">
                      {formSuccess && (
                          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg">
                              <div className="flex">
                                  <div className="flex-shrink-0">
                                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                  </div>
                                  <div className="ml-3">
                                      <p className="text-sm font-medium">
                                          ¡Bienvenido de vuelta, entrenador! Preparando tu viaje...
                                      </p>
                                  </div>
                              </div>
                          </div>
                      )}
                      
                      {errors.submit && (
                          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                              <div className="flex">
                                  <div className="flex-shrink-0">
                                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                  </div>
                                  <div className="ml-3">
                                      <p className="text-sm font-medium">{errors.submit}</p>
                                  </div>
                              </div>
                          </div>
                      )}
                      
                      <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold text-gray-800">Acceso de Entrenador</h2>
                          <p className="text-gray-600 mt-2">Ingresa tus credenciales para continuar</p>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
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
                                      className={`py-3 pl-10 w-full border ${errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-xl shadow-sm`}
                                      placeholder="ash.ketchum@pokemon.com"
                                  />
                              </div>
                              {errors.email && (
                                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                              )}
                          </div>
                          
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                  Contraseña Secreta
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
                                      className={`py-3 pl-10 w-full border ${errors.password ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-xl shadow-sm`}
                                      placeholder="••••••••"
                                  />
                              </div>
                              {errors.password && (
                                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                              )}
                          </div>
                          
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
                                      Recordar sesión
                                  </label>
                              </div>
                              
                              <div className="text-sm">
                                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                      ¿Olvidaste tu contraseña?
                                  </a>
                              </div>
                          </div>
                          
                          <div>
                              <Link to="/team-builder"
                                  type="submit"
                                  disabled={isSubmitting}
                                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                              >
                                  {isSubmitting ? (
                                      <>
                                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          <span>Iniciando sesión...</span>
                                      </>
                                  ) : (
                                      <span>Iniciar Aventura</span>
                                  )}
                              </Link>
                          </div>
                      </form>
                      
                      <div className="mt-8">
                          <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-gray-300"></div>
                              </div>
                              <div className="relative flex justify-center text-sm">
                                  <span className="px-2 bg-white text-gray-500">O continúa con</span>
                              </div>
                          </div>
                          
                          <div className="mt-6 grid grid-cols-3 gap-3">
                              <div>
                                  <Link to="/team-builder" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                      <span className="sr-only">Inicia sesión con Google</span>
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.139 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" />
                                      </svg>
                                  </Link>
                              </div>
                              
                              <div>
                                  <Link to="/team-builder" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                      <span className="sr-only">Inicia sesión con Facebook</span>
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                                      </svg>
                                  </Link>
                              </div>
                              
                              <div>
                                  <Link to="team-builder" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                      <span className="sr-only">Inicia sesión con Twitter</span>
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                      </svg>
                                  </Link>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                      <p className="text-sm text-gray-600">
                          ¿No tienes una cuenta? 
                          <Link to="/register" className="ml-1 font-medium text-red-600 hover:text-red-500">
                              Regístrate
                          </Link>
                      </p>
                      
                      <div className="flex space-x-4">
                          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              Inicio
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}