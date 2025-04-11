import React, {useState} from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';
import { Link } from '../../../Link';

// Componente moderno para los enlaces de Login/Signup
const AuthLinks = () => {
    const { t } = useTranslation();
    const [hovered, setHovered] = useState(null);
  
    return (
      <div className="absolute right-4 top-4">
        <div className="flex items-center bg-white/10 dark:bg-gray-800/20 rounded-t-lg ">
          {/* Enlace de Login */}
          <Link
            to="/login"
            className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 ${
              hovered === 'login' 
                ? 'bg-white/20 dark:bg-gray-700/50 text-green-700 dark:text-green-400' 
                : 'text-gray-700 dark:text-gray-300'
            } hover:text-green-700 dark:hover:text-green-400 rounded-tl-lg`}
            onMouseEnter={() => setHovered('login')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1.5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {t('login')}
            </div>
            
            {/* Indicador de pestaña activa */}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 ${
              hovered === 'login' ? 'bg-green-500 dark:bg-green-400' : 'bg-transparent'
            } transition-colors duration-300`}></span>
          </Link>
          
          {/* Enlace de Signup */}
          <Link
            to="/signup"
            className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 ${
              hovered === 'signup' 
                ? 'bg-white/20 dark:bg-gray-700/50 text-green-700 dark:text-green-400' 
                : 'text-gray-700 dark:text-gray-300'
            } hover:text-green-700 dark:hover:text-green-400 rounded-tr-lg`}
            onMouseEnter={() => setHovered('signup')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1.5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              {t('signup')}
            </div>
            
            {/* Indicador de pestaña activa */}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 ${
              hovered === 'signup' ? 'bg-green-500 dark:bg-green-400' : 'bg-transparent'
            } transition-colors duration-300`}></span>
          </Link>
        </div>
      </div>
    );
  };

export default AuthLinks;