import Page404 from './components/pages/404.jsx';
import Login from './components/pages/Login/Login.jsx';
import Pokedex from './components/pages/Pokedex/pokedex.jsx';
import SignUp from './components/pages/SignUp/SignUp.jsx';
import PokemonTeamBuilder from './components/pages/TeamBuilder.jsx';
import {Router} from './Router/Router.jsx';
import { ThemeProvider } from './components/pages/Pokedex/ThemeProvider'; // Importa el ThemeProvider

const AppRoutes = [
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/signup',
        Component: SignUp
    },
    {
        path: '/team-builder',
        Component: PokemonTeamBuilder
    },
    {
        path: '/',
        Component: Pokedex
    }
]

function App(){
    return(
        <ThemeProvider> {/* Envuelve toda la aplicación con ThemeProvider */}
            <main>
                <Router routes={AppRoutes} defaultComponent={Page404}/>
            </main>
        </ThemeProvider>
    )
}

export default App;