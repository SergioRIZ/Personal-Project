import React from 'react';
import SignUpHeader from './components/SignUpHeader';
import SignUpForm from './components/SignUpForm';
import SignUpFooter from './components/SignUpFooter';
import SocialAuth from './components/SocialAuth';
import Alert from './components/Alert';
import useForm from './hooks/useForm';
import { validateSignUpForm } from './hooks/validation';
import { signUp } from '../../../lib/auth';
import { navigate } from '../../../navigation';

const SignUp = () => {
  const {
    formData,
    errors,
    setErrors,
    isSubmitting,
    formSuccess,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
  } = useForm(
    { username: '', email: '', password: '', confirmPassword: '' },
    validateSignUpForm
  );

  const onSubmit = async (data: Record<string, string>) => {
    const { error } = await signUp(data.email, data.password, data.username);
    if (error) {
      setErrors({ submit: error.message });
      throw new Error(error.message);
    }
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-900 dark:to-gray-800 py-6 flex flex-col items-center justify-center p-4 relative">
      <SignUpHeader isSubmitting={isSubmitting} />

      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
          <div className="h-3 bg-gradient-to-r from-green-600 to-slate-700"></div>

          <div className="p-5 sm:p-8">
            {formSuccess && (
              <Alert
                type={Alert.types.SUCCESS}
                message="¡Cuenta creada! Revisa tu email para confirmarla."
              />
            )}

            {errors.submit && (
              <Alert type={Alert.types.ERROR} message={errors.submit} />
            )}

            <SignUpForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSubmit={(e: React.FormEvent) => handleSubmit(e, onSubmit)}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            <SocialAuth />
          </div>

          <SignUpFooter />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
