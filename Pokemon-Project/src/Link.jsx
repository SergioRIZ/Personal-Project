import { BUTTONS, EVENTS } from "./const";

export function navigate(href) {
    // Obtener la base URL del repositorio
    const base = import.meta.env.BASE_URL || '/';
    let fullPath = href;
    
    // Si href es una ruta relativa y tenemos una base URL diferente a '/'
    if (base !== '/' && href.startsWith('/')) {
        // Asegurarnos de que no añadimos doble slash
        fullPath = base.endsWith('/') ? base.slice(0, -1) + href : base + href;
    }
    
    window.history.pushState({}, '', fullPath);
    const navigationEvent = new Event(EVENTS.PUSHSTATE);
    window.dispatchEvent(navigationEvent);
}

export function Link({target, to, ...props}) {
    const handleClick = (e) => {
        const isMainEvent = e.button === BUTTONS.primary; // primary click
        const isModifiedEvent = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;
        const isManageableEvent = target === undefined || target === '_self';
        
        if (isMainEvent && isManageableEvent && !isModifiedEvent) {  
            e.preventDefault();
            navigate(to);
        }
    }
    
    return <a onClick={handleClick} href={to} target={target} {...props} />;
}