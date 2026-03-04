import React, { useState, useEffect } from 'react';
import { EVENTS } from '../const';

interface Route {
  path: string;
  Component: React.ComponentType;
}

interface RouterProps {
  routes?: Route[];
  defaultComponent?: React.ComponentType;
}

export function Router({
  routes = [],
  defaultComponent: DefaultComponent = () => <></>,
}: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.pathname);

    window.addEventListener(EVENTS.PUSHSTATE, onLocationChange);
    window.addEventListener(EVENTS.POPSTATE, onLocationChange);

    return () => {
      window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange);
      window.removeEventListener(EVENTS.POPSTATE, onLocationChange);
    };
  }, []);

  const Page = routes.find(({ path }) => {
    if (path === currentPath) return true;
    // Support dynamic segments like /pokemon/:id
    if (path.includes(':')) {
      const prefix = path.slice(0, path.indexOf(':'));
      return currentPath.startsWith(prefix) && currentPath.length > prefix.length;
    }
    return false;
  })?.Component;

  return Page ? <Page /> : <DefaultComponent />;
}
