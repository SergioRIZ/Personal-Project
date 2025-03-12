import React from "react";
import SignUpHeader from "./components/SignUpHeader";
import SignUpForm from "./components/SignUpForm";
import SignUpFooter from "./components/SignUpFooter";
import SocialAuth from "./components/SocialAuth";
import Alert from "./components/Alert";
import useForm from "./hooks/useForm";
import { validateSignUpForm } from "./hooks/validation";

const SignUp = () => {
  // Use custom form hook with initial values
  const {
    formData,
    errors,
    isSubmitting,
    formSuccess,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit
  } = useForm(
    {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validateSignUpForm
  );

  // Form submission handler
  const onSubmit = async (data) => {
    console.log("Registration data:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Normally you would return the result of the API call
    return true;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/pokemon-background.svg')] p-4 bg-no-repeat bg-cover bg-center">
      {/* Header with logo */}
      <SignUpHeader isSubmitting={isSubmitting} />
      
      <div className="max-w-md w-full mx-auto">
        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-102">
          {/* Colorful top bar */}
          <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
          
          {/* Content area */}
          <div className="p-8">
            {/* Success message */}
            {formSuccess && (
              <Alert 
                type={Alert.types.SUCCESS}
                message="Congratulations! Your trainer account has been created."
                action={{
                  to: "/team-builder",
                  label: "Continue"
                }}
              />
            )}
            
            {/* Error message */}
            {errors.submit && (
              <Alert 
                type={Alert.types.ERROR}
                message={errors.submit}
              />
            )}
            
            {/* Registration form */}
            <SignUpForm 
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSubmit={(e) => handleSubmit(e, onSubmit)}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />
            
            {/* Social auth options */}
            <SocialAuth />
          </div>
          
          {/* Footer */}
          <SignUpFooter />
        </div>
      </div>
    </div>
  );
};

export default SignUp;