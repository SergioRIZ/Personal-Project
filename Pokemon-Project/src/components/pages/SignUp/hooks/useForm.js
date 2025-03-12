import { useState } from "react";

const useForm = (initialValues, validateFn) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e, onSubmit) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const isValid = validateFn ? validateFn(formData, setErrors) : true;
    
    if (isValid) {
      try {
        await onSubmit(formData);
        setFormSuccess(true);
      } catch (error) {
        console.error("Form submission error:", error);
        setErrors({ submit: "An error occurred. Please try again." });
      }
    }
    
    setIsSubmitting(false);
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    formSuccess,
    setFormSuccess,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit
  };
};

export default useForm;