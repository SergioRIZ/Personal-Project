import React, { lazy, Suspense } from 'react';
import { Router } from './Router/Router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CollectionProvider } from './context/CollectionContext';
import { TeamsProvider } from './context/TeamsContext';

const Login = lazy(() => import('./components/pages/Login/Login'));
const Pokedex = lazy(() => import('./components/pages/Pokedex/pokedex'));
const Settings = lazy(() => import('./components/pages/Settings/Settings'));
const SignUp = lazy(() => import('./components/pages/SignUp/SignUp'));
const Profile = lazy(() => import('./components/pages/Profile/Profile'));
const Teams = lazy(() => import('./components/pages/Teams/Teams'));
const Page404 = lazy(() => import('./components/pages/404'));

const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppRoutes = [
  { path: '/login', Component: Login },
  { path: '/signup', Component: SignUp },
  { path: '/', Component: Pokedex },
  { path: '/settings', Component: Settings },
  { path: '/profile', Component: Profile },
  { path: '/teams', Component: Teams },
];

function App() {
  return (
    <SettingsProvider>
    <AuthProvider>
    <CollectionProvider>
    <TeamsProvider>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <main>
            <Router routes={AppRoutes} defaultComponent={Page404} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </TeamsProvider>
    </CollectionProvider>
    </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
