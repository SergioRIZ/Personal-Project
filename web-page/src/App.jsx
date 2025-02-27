import React from "react";
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Formulario from "./formulario";
import pokedex from "./components/pokedex"

function App() {
    return (
        <Router>
            <nav>
                <ul>
                <li>
                <Link to="/">Formulario</Link>
                </li>
                <li>
                <Link to="/pokedex">Pokedex</Link>
                </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" exact element={<Formulario />} />
                <Route path="/pokedex" element={<pokedex />} />
                <Route patch="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;