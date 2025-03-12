import React from "react";

const PasswordStrengthMeter = ({ password }) => {
  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains numbers
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const passwordStrength = calculatePasswordStrength(password);
  
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">Password security</span>
        <span className="text-xs font-medium">{getStrengthLabel()}</span>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getStrengthColor()}`} 
          style={{ width: `${(passwordStrength / 5) * 100}%` }}
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="5"
          aria-valuenow={passwordStrength}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;