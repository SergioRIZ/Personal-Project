/**
 * Validates signup form data
 * @param {Object} formData - The form data to validate
 * @param {Function} setErrors - Function to set errors
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateSignUpForm = (formData, setErrors) => {
    const newErrors = {};
    
    // Validate username
    if (!formData.username?.trim()) {
      newErrors.username = "Trainer name is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Name must be at least 3 characters";
    }
    
    // Validate email
    if (!formData.email?.trim()) {
      newErrors.email = "PokéEmail is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid PokéEmail";
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, and numbers";
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Calculates password strength on a scale of 0-5
   * @param {string} password - The password to check strength for
   * @returns {number} - Strength score from 0-5
   */
  export const calculatePasswordStrength = (password) => {
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