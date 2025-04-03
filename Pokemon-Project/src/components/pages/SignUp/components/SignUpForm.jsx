import React from "react";
import FormField from "./FormField";
import Button from "./Button";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const SignUpForm = ({ 
    formData, 
    errors, 
    isSubmitting, 
    handleChange, 
    handleSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword
  }) => {
    // User icon for username field
    const userIcon = (
      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    );
  
    // Email icon
    const emailIcon = (
      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    );
  
    // Lock icon
    const lockIcon = (
      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    );
  
    // Show/Hide Password Button for password field
    const passwordToggleButton = (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
        )}
      </button>
    );
  
    // Show/Hide Confirm Password Button
    const confirmPasswordToggleButton = (
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
      >
        {showConfirmPassword ? (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
        )}
      </button>
    );
  
    return (
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700">Trainer Account</h2>
        <p className="text-gray-600 mt-2">Create your account and start your adventure!</p>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Username field */}
          <FormField
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            label="Trainer Name"
            placeholder="Ash Ketchum"
            error={errors.username}
            icon={userIcon}
          />
          
          {/* Email field */}
          <FormField
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            label="PokéEmail"
            placeholder="trainer@pokemon.com"
            error={errors.email}
            icon={emailIcon}
          />
          
          {/* Password field */}
          <div>
            <FormField
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              label="Secret Password"
              placeholder="••••••••"
              error={errors.password}
              icon={lockIcon}
              rightElement={passwordToggleButton}
            />
            
            {/* Password strength meter */}
            <PasswordStrengthMeter password={formData.password} />
          </div>
          
          {/* Password confirmation field */}
          <FormField
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            icon={lockIcon}
            rightElement={confirmPasswordToggleButton}
          />
          
          {/* Submit button */}
          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Start Adventure
            </Button>
          </div>
        </form>
      </div>
    );
  };
  
  export default SignUpForm;