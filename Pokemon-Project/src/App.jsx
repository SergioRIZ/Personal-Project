import Page404 from './components/pages/404.jsx';
import Login from './components/pages/Login/Login.jsx';
import Pokedex from './components/pages/Pokedex/pokedex.jsx';
import Settings from './components/pages/Settings/Settings.jsx';
import SignUp from './components/pages/SignUp/SignUp.jsx';
import {Router} from './Router/Router.jsx';


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
        path: '/',
        Component: Pokedex
    },
    {
        path: '/settings',
        Component: Settings

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