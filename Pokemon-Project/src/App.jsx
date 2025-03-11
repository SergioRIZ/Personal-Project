import Page404 from './components/pages/404.jsx';
import Home from './components/pages/Home.jsx'
import Login from './components/pages/Login.jsx';
import Pokedex from './components/pages/Pokedex/pokedex.jsx';
import Register from './components/pages/Register.jsx';
import PokemonTeamBuilder from './components/pages/TeamBuilder.jsx';
import {Router} from './Router/Router.jsx';

const AppRoutes = [
    {
        path: '/',
        Component: Home
    },
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/register',
        Component: Register
    },
    {
        path: '/team-builder',
        Component: PokemonTeamBuilder
    },
    {
        path: '/pokedex',
        Component: Pokedex
    }
]

function App(){

    return(
        <main>
            <Router routes={AppRoutes} defaultComponent={Page404}/>
        </main>
    )
}

export default App;