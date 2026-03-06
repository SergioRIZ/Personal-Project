import '../css/register.css';
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
    <div className="min-h-screen app-bg py-6 flex flex-col items-center justify-center p-4">
      <LoginHeader />

      <div className="max-w-md w-full mx-auto">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)]">
          <div className="accent-bar" />

          <div className="p-5 sm:p-8">
            {formSuccess && (
              <Alert type="success" message="¡Bienvenido de vuelta, entrenador! Preparando tu viaje..." />
            )}
            {errors.submit && (
              <Alert type="error" message={errors.submit} />
            )}

            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                Acceso de Entrenador
              </h2>
              <p className="text-[var(--text-secondary)] mt-2">Ingresa tus credenciales para continuar</p>
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
