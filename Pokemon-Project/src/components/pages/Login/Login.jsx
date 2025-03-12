import React from "react";
import "../css/register.css";

// Importamos los componentes usando el archivo de índice
import {
  LoginHeader,
  LoginForm,
  LoginFooter,
  Alert
} from "./components";

// Importamos el custom hook con la lógica
import useLoginForm from "./hooks/useLoginForm";

export default function Login() {
  const {
    formData,
    errors,
    isSubmitting,
    formSuccess,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword
  } = useLoginForm();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/pokemon-background.svg')] p-4 bg-no-repeat bg-cover bg-center">
      <LoginHeader />
      
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
          {/* Barra superior colorida */}
          <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
          
          {/* Área de contenido */}
          <div className="p-8">
            {formSuccess && (
              <Alert 
                type="success" 
                message="¡Bienvenido de vuelta, entrenador! Preparando tu viaje..." 
              />
            )}
            
            {errors.submit && (
              <Alert 
                type="error" 
                message={errors.submit} 
              />
            )}
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Acceso de Entrenador</h2>
              <p className="text-gray-600 mt-2">Ingresa tus credenciales para continuar</p>
            </div>
            
            <LoginForm 
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              showPassword={showPassword}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              toggleShowPassword={toggleShowPassword}
            />
          </div>
          
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}