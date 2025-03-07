import Page404 from './pages/404.jsx';
import Home from './pages/Home'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PokemonTeamBuilder from './pages/TeamBuilder.jsx';
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

