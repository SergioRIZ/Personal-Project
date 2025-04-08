import { BUTTONS, } from "./const";
import { navigate } from "./navigation";


export function Link ({target, to, ...props}) {
    const handleClick = (e) =>{
        const isMainEvent = e.button === BUTTONS.primary //primary click
        const isModifiedEvent = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey
        const isManageableEvent = target === undefined || target === '_self'
        
        if (isMainEvent && isManageableEvent && !isModifiedEvent){  
            e.preventDefault();
            navigate(to)
        }
    }

    // Elimina esta línea - está causando los errores
    // console.log(props.children)
    
    return <a onClick={handleClick} href={to} target={target} {...props}/>
}