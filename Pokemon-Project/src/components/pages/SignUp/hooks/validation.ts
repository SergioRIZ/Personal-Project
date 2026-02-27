type FormData = Record<string, string | undefined>;
type SetErrors = (errors: Record<string, string>) => void;

export const validateSignUpForm = (formData: FormData, setErrors: SetErrors): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.username?.trim()) {
    newErrors.username = 'Trainer name is required';
  } else if ((formData.username?.length ?? 0) < 3) {
    newErrors.username = 'Name must be at least 3 characters';
  }

  if (!formData.email?.trim()) {
    newErrors.email = 'PokéEmail is required';
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    newErrors.email = 'Enter a valid PokéEmail';
  }

  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if ((formData.password?.length ?? 0) < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    newErrors.password = 'Password must include uppercase, lowercase, and numbers';
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords don't match";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8)         strength += 1;
  if (/[a-z]/.test(password))       strength += 1;
  if (/[A-Z]/.test(password))       strength += 1;
  if (/[0-9]/.test(password))       strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};
