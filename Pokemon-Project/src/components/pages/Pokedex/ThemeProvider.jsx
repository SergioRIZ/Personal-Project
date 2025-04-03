import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto del tema
const ThemeContext = createContext();

// Hook personalizado para usar el contexto del tema
export const useTheme = () => useContext(ThemeContext);

// Componente proveedor del tema
export const ThemeProvider = ({ children }) => {
  // Intentar recuperar el tema de localStorage al inicio
  const [darkMode, setDarkMode] = useState(() => {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Si no hay tema guardado, usar la preferencia del sistema
    if (savedTheme === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return savedTheme === 'dark';
  });

  // Función para cambiar entre temas
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Efecto para aplicar la clase dark al elemento HTML
  useEffect(() => {
    // Más explícito con ambos modos
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
    
    // Forzar una actualización del DOM
    document.body.style.backgroundColor = darkMode ? '' : '';
    
    console.log("Tema cambiado a:", darkMode ? "oscuro" : "claro");
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  // Proporcionar valores y funciones a través del contexto
  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;