import { useState } from "react";
import { navigate } from "../../../../Link";

export default function useLoginForm() {
  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpia el error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El PokéEmail es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Ingresa un PokéEmail válido";
    }
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        // Simular envío al servidor (aquí iría la lógica de API)
        console.log('Datos del formulario:', formData);
        
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mostrar éxito
        setFormSuccess(true);
        
        // Redireccionar después de 2 segundos
        setTimeout(() => {
          console.log('Redireccionando al panel de entrenador...');
          navigate('/team-builder');
        }, 2000);
        
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        setErrors({ submit: "Credenciales incorrectas. Verifica tu PokéEmail y contraseña." });
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  // Toggle para mostrar/ocultar contraseña
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    formData,
    errors,
    isSubmitting,
    formSuccess,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword
  };
}