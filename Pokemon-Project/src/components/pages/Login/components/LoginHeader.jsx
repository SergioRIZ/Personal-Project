import React from "react";
import { Link } from "../../../../Link";
import Pokeball from "./Pokeball";

const LoginHeader = () => {
  return (
    <div className="mb-8 text-center">
      <Link to="/pokedex" className="inline-block">
        <Pokeball />
      </Link>
      <h1 className="text-5xl font-bold text-red-600 mb-2 text-shadow">Liga Pokémon</h1>
      <p className="text-black text-lg text-shadow">Plataforma oficial para entrenadores</p>
    </div>
  );
};

export default LoginHeader;