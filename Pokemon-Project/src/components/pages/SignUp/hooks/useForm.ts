import { useState } from 'react';

type FormValues = Record<string, string>;
type FormErrors = Record<string, string | null>;
type ValidateFn = (data: FormValues, setErrors: (errors: FormErrors) => void) => boolean;

const useForm = (initialValues: FormValues, validateFn?: ValidateFn) => {
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    onSubmit: (data: FormValues) => Promise<void>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateFn ? validateFn(formData, setErrors) : true;

    if (isValid) {
      try {
        await onSubmit(formData);
        setFormSuccess(true);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred. Please try again.';
        setErrors({ submit: message });
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
    handleSubmit,
  };
};

export default useForm;
