import React from "react";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";

interface Props {
  formData: { email: string; password: string; rememberMe: boolean };
  errors: { email?: string | null; password?: string | null };
  isSubmitting: boolean; showPassword: boolean;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler;
  toggleShowPassword: () => void;
}

const LoginForm = ({ formData, errors, isSubmitting, showPassword, handleChange, handleSubmit, toggleShowPassword }: Props) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="PokéEmail"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="ash.ketchum@pokemon.com"
          icon={
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          }
        />
        
        <PasswordInput
          id="password"
          name="password"
          label="Contraseña Secreta"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
          placeholder="••••••••"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Recordar sesión
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-green-600 hover:text-green-800 transition-colors duration-200">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-xl">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center py-3 px-4 border-0 shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-slate-700 hover:from-green-700 hover:to-slate-800 cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200`}
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
          </button>
        </div>
      </form>
      
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;