import { BUTTONS, EVENTS } from "./const";

export function navigate (href){
    window.history.pushState({}, '', href);
    const navigationEvent = new Event(EVENTS.PUSHSTATE)
    window.dispatchEvent(navigationEvent);
}

export function Link ({target, to, ...props}) {
    const handleClick = (e) =>{
    const isMainEvent = e.button === BUTTONS.primary //primary click
    const isModifiedEvent = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey
    const isManageableEvent = target === undefined || target === '_self'
    
    if (isMainEvent && isManageableEvent  && !isModifiedEvent){  
        e.preventDefault();
        navigate(to)
    }
    }

        console.log (props.children)
        return <a onClick={handleClick} href={to} target={target} {...props}/>
}