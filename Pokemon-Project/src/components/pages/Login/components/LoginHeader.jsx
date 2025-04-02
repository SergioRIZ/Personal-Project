import React from "react";
import { Link } from "../../../../Link";
import Pokeball from "./Pokeball";

const LoginHeader = () => {
  return (
    <div className="mb-8 text-center">
      <Link to="/pokedex" className="inline-block">
        <Pokeball />
      </Link>
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 mb-2 drop-shadow-md" style={{ lineHeight: "1.2", paddingBottom: "0.1em" }}>Liga Pokémon</h1>
      <p className="text-black text-lg mt-4">Plataforma oficial para entrenadores</p>
    </div>
  );
};

export default LoginHeader;