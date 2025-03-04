import { EVENTS } from '../const';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types'

Router.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      Component: PropTypes.elementType.isRequired
    })
  ),
  defaultComponent: PropTypes.elementType
}
export function Router ({routes = [], defaultComponent: DefaultComponent = () => <></>}) {
    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    useEffect(() =>{
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname)
        }
        window.addEventListener(EVENTS.PUSHSTATE, onLocationChange)
        window.addEventListener(EVENTS.POPSTATE, onLocationChange) 

        return () => {
            window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange)
            window.removeEventListener(EVENTS.POPSTATE, onLocationChange)
        }
    }, [])

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