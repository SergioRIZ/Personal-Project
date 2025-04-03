import React, { useState, useEffect, useRef } from 'react';
import { Link } from '../../../Link';
import { useTheme } from './ThemeProvider';

const DropdownMenu = () => {
  // Estado principal para el menú
  const [isOpen, setIsOpen] = useState(false);
  // Estado separado para controlar la visibilidad del botón
  const [showButton, setShowButton] = useState(true);
  // Usar el contexto del tema en lugar del estado local
  const { darkMode, toggleTheme } = useTheme();
  
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Definición de un SVG inline para Pokédex
  const PokedexIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5Z" />
    </svg>
  );
  
  // Componente personalizado para equipos
  const TeamsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
    </svg>
  );

  // Componente personalizado para modo oscuro
  const DarkModeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
    </svg>
  );
  
  // Componente para luz (modo claro)
  const LightModeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" />
    </svg>
  );

  // Función que cierra el menú y cambia el tema
  const handleToggleTheme = () => {
    toggleTheme();
    closeMenu();
  };

  const menuItems = [
    { label: 'Pokedex', to: '/', icon: <PokedexIcon /> },
    { label: 'Settings', to: '/settings', icon: '⚙️' },
    { label: 'Teams', to: '/teams', icon: <TeamsIcon /> },
    { 
      label: darkMode ? 'Light Mode' : 'Dark Mode', 
      to: '#', 
      icon: darkMode ? <LightModeIcon /> : <DarkModeIcon />,
      onClick: handleToggleTheme
    },
    { label: 'Login', to: '/login', icon: '👤' }
  ];

  // Función para abrir el menú
  const openMenu = () => {
    setShowButton(false); // Ocultar el botón inmediatamente
    setIsOpen(true);
  };

  // Función para cerrar el menú con retraso para el botón
  const closeMenu = () => {
    if (isOpen) {
      // Primero cerramos el menú
      setIsOpen(false);
      // No mostramos el botón todavía, esperaremos a que termine la transición
    }
  };

  // Control de clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    // Solo agregamos el event listener cuando el menú está abierto
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Efecto para restaurar el botón si hay algún problema con la transición
  useEffect(() => {
    // Si el menú está cerrado, eventualmente debemos mostrar el botón
    if (!isOpen) {
      // Usamos un timeout para asegurar que el botón aparezca después de la transición
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 600); // Un poco más que los 500ms de la transición
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="z-50">
      {/* Botón del menú - visible solo cuando showButton es true */}
      <button
        ref={buttonRef}
        className={`fixed top-4 left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-800 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 z-50 ${
          showButton ? 'block' : 'hidden'
        }`}
        onClick={openMenu}
        aria-expanded={isOpen}
        aria-label="Menu"
      >
        <span className="text-white text-xl">☰</span>
      </button>
      
      {/* Overlay oscuro cuando el menú está abierto */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-500 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />
      
      {/* Menú lateral - con transición suave */}
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-500 ease-in-out z-45 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onTransitionEnd={() => {
          // Cuando la transición termina y el menú está cerrado
          if (!isOpen) {
            // Usamos setTimeout para asegurar que ocurra después de que React haya actualizado el DOM
            setTimeout(() => {
              setShowButton(true);
            }, 50);
          }
        }}
      >
        {/* Encabezado del menú con botón de cerrar */}
        <div className="p-6 bg-green-50 dark:bg-green-900 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-lg font-bold text-green-800 dark:text-green-200">Menu</span>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            <span className="text-green-600 dark:text-green-300 text-xl">&times;</span>
          </button>
        </div>
        
        {/* Elementos del menú */}
        <div className="py-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center px-6 py-4 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-800 hover:text-green-600 dark:hover:text-green-300 transition-all duration-200 group border-l-4 border-transparent hover:border-green-500"
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                } else {
                  closeMenu();
                }
              }}
            >
              <span className="mr-4 text-lg text-gray-400 group-hover:text-green-500 dark:group-hover:text-green-300">
                {typeof item.icon === 'string' ? item.icon : item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;