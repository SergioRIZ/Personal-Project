import { lazy, Suspense, useState, useEffect } from 'react';
import { Router } from './Router/Router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CollectionProvider } from './context/CollectionContext';
import { TeamsProvider } from './context/TeamsContext';
import { EVENTS } from './const';
import DropdownMenu from './components/pages/Pokedex/DropdownMenu';

const Landing = lazy(() => import('./components/pages/Landing/Landing'));
const Login = lazy(() => import('./components/pages/Login/Login'));
const Pokedex = lazy(() => import('./components/pages/Pokedex/pokedex'));
const Settings = lazy(() => import('./components/pages/Settings/Settings'));
const SignUp = lazy(() => import('./components/pages/SignUp/SignUp'));
const Profile = lazy(() => import('./components/pages/Profile/Profile'));
const Teams = lazy(() => import('./components/pages/Teams/Teams'));
const TeamsBuilder = lazy(() => import('./components/pages/Teams/TeamsBuilder'));
const PokemonDetail = lazy(() => import('./components/pages/Pokedex/Pokemon/PokemonDetail'));
const Page404 = lazy(() => import('./components/pages/404'));

const PageLoader = () => (
  <div className="min-h-screen app-bg flex items-center justify-center">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
      <div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)]"
        style={{ animation: 'pokeball-spin 0.8s linear infinite' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
      </div>
    </div>
  </div>
);

const NO_NAV_PATHS = ['/login', '/signup'];

function GlobalNav() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener(EVENTS.PUSHSTATE, update);
    window.addEventListener(EVENTS.POPSTATE, update);
    return () => {
      window.removeEventListener(EVENTS.PUSHSTATE, update);
      window.removeEventListener(EVENTS.POPSTATE, update);
    };
  }, []);
  if (NO_NAV_PATHS.includes(path)) return null;
  return <DropdownMenu />;
}

const AppRoutes = [
  { path: '/', Component: Landing },
  { path: '/pokedex', Component: Pokedex },
  { path: '/pokemon/:id', Component: PokemonDetail },
  { path: '/login', Component: Login },
  { path: '/signup', Component: SignUp },
  { path: '/settings', Component: Settings },
  { path: '/profile', Component: Profile },
  { path: '/teams', Component: Teams },
  { path: '/teamsbuilder/:id', Component: TeamsBuilder },
];

function App() {
  return (
    <SettingsProvider>
    <AuthProvider>
    <CollectionProvider>
    <TeamsProvider>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <main className="grain">
            <GlobalNav />
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
