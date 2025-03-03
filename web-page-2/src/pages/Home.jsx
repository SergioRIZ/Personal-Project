import {Link} from '../Link.jsx';
export default function Home (){
    return(
        <>
        <h1>Bienvenido al maravilloso mundo de los pokémon</h1>
        <Link to='/login'>Inicio de sesion</Link>
        <Link to='/register'>Register</Link>
        </>
    )
}
