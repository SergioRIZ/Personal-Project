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

  const Page = routes.find(({ path }) => path === currentPath)?.Component;

  return Page ? <Page /> : <DefaultComponent />;
}
