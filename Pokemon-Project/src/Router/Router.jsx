import { EVENTS } from '../const';
import { useState, useEffect } from "react";

export function Router ({routes = [], defaultComponent: DefaultComponent = () => <></>}) {
    const [currentPath, setCurrentPath] = useState(getCurrentPath())
    
    // Función para obtener la ruta actual considerando el basename
    function getCurrentPath() {
        const base = import.meta.env.BASE_URL || '/';
        let path = window.location.pathname;
        
        // Si la base no es '/' y el path comienza con la base, eliminar la base
        if (base !== '/' && path.startsWith(base)) {
            path = path.slice(base.length - 1); // -1 para mantener la / inicial
            if (!path) path = '/'; // Si queda vacío, usar '/'
        }
        
        return path;
    }

    useEffect(() =>{
        const onLocationChange = () => {
            setCurrentPath(getCurrentPath())
        }
        
        window.addEventListener(EVENTS.PUSHSTATE, onLocationChange)
        window.addEventListener(EVENTS.POPSTATE, onLocationChange) 

        return () => {
            window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange)
            window.removeEventListener(EVENTS.POPSTATE, onLocationChange)
        }
    }, [])

    // Modificar las funciones de navegación global si existen en tu aplicación
    useEffect(() => {
        // Guardar la referencia original
        const originalPushState = window.history.pushState;
        
        // Sobrescribir con nuestra versión que maneja el basename
        window.history.pushState = function(state, title, url) {
            // Añadir basename si es una ruta relativa
            if (url && url.startsWith('/') && !url.startsWith('/http')) {
                const base = import.meta.env.BASE_URL || '/';
                if (base !== '/') {
                    url = base.endsWith('/') ? base.slice(0, -1) + url : base + url;
                }
            }
            
            // Llamar al método original
            return originalPushState.call(this, state, title, url);
        };
        
        return () => {
            // Restaurar el método original al desmontar
            window.history.pushState = originalPushState;
        };
    }, []);

    const Page = routes.find(({path}) => path === currentPath)?.Component
    if (!Page && !DefaultComponent) {
      throw new Error('No matching route found and no default component provided')
    }
    
    return Page ? (
        <Page />
    ) : (
        <DefaultComponent />
    )
}