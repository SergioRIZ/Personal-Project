import React from 'react';
import '../css/register.css';
import { Link } from '../../../Link';
import { LoginHeader, LoginForm, LoginFooter, Alert } from './components';
import useLoginForm from './hooks/useLoginForm';

export default function Login() {
  const {
    formData,
    errors,
    isSubmitting,
    formSuccess,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
  } = useLoginForm();

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-900 dark:to-gray-800 py-6 flex flex-col items-center justify-center p-4">
      <LoginHeader />

      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
          <div className="h-3 bg-gradient-to-r from-green-600 to-slate-700" />

          <div className="p-5 sm:p-8">
            {formSuccess && (
              <Alert type="success" message="¡Bienvenido de vuelta, entrenador! Preparando tu viaje..." />
            )}
            {errors.submit && (
              <Alert type="error" message={errors.submit} />
            )}

            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 dark:from-green-400 dark:to-slate-300">
                Acceso de Entrenador
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Ingresa tus credenciales para continuar</p>
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
