import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '../../../Link';

const DropdownMenu = () => {
  // Estado principal para el menú
  const [isOpen, setIsOpen] = useState(false);
  // Estado separado para controlar la visibilidad del botón
  const [showButton, setShowButton] = useState(true);
  
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Componentes de íconos mantienen iguales...
  const TeamsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1">
      <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1">
      <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
    </svg>
  );

  const menuItems = [
    { label: 'Settings', to: '/settings', icon: <SettingsIcon /> },
    { label: 'Teams', to: '/team-builder', icon: <TeamsIcon /> },
  ];

  // Función para abrir el menú
  const openMenu = () => {
    setShowButton(false);
    setIsOpen(true);
  };

  // Función para cerrar el menú con retraso para el botón
  const closeMenu = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  // Resto de useEffect se mantienen iguales...
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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeMenu]);
  
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="z-50">
      {/* Botón del menú */}
      <button
        ref={buttonRef}
        className={`fixed top-4 left-4 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-[#1a2234] dark:to-[#141b2d] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 z-50 ${
          showButton ? 'block' : 'hidden'
        }`}
        onClick={openMenu}
        aria-expanded={isOpen}
        aria-label="Menu"
      >
        <span className="text-white text-xl">☰</span>
      </button>
      
      {/* Overlay oscuro */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-500 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />
      
      {/* Menú lateral */}
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 dark:bg-[#1a2234] shadow-2xl transform transition-transform duration-500 ease-in-out z-45 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onTransitionEnd={() => {
          if (!isOpen) {
            setTimeout(() => {
              setShowButton(true);
            }, 50);
          }
        }}
      >
        {/* Encabezado del menú */}
        <div className="p-6 bg-gray-900 dark:bg-[#1a2234] border-b border-gray-800 flex items-center justify-between">
          <span className="text-lg font-bold text-white">Menu</span>
          <button 
            className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-gray-800 transition-colors duration-200 cursor-pointer relative"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            <span className="absolute inset-0 flex items-center justify-center text-white text-xl" style={{ lineHeight: 0, marginTop: "-4px" }}>&times;</span>
          </button>
        </div>
        
        {/* Elementos del menú - MODIFICADO AQUÍ */}
        <div className="py-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center px-6 py-4 text-white hover:bg-gray-800 dark:hover:bg-[#2a3245] transition-all duration-200 group border-l-0 border-transparent"
              onClick={(e) => {
                // La clave está aquí: siempre prevenir el comportamiento por defecto
                e.preventDefault();
                
                // Cerrar el menú primero
                closeMenu();
                
                // Luego, si hay un onClick personalizado, ejecutarlo
                if (item.onClick) {
                  item.onClick();
                } else {
                  // Si no hay onClick personalizado, navegar manualmente
                  // usando la función navigate de tu navegación personalizada
                  // Importamos y usamos navigate desde tu archivo de navegación
                  import('../../../navigation').then(({ navigate }) => {
                    // Pequeño tiempo de espera para asegurarse de que el menú comience a cerrarse
                    setTimeout(() => {
                      navigate(item.to);
                    }, 50);
                  });
                }
              }}
            >
              <div className="flex items-center w-8">
                {typeof item.icon === 'string' ? item.icon : item.icon}
              </div>
              <span className="font-medium ml-3">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;