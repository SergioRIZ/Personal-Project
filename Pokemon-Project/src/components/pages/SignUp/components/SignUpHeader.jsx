import React from "react";
import Pokeball from "./Pokeball";
import { Link } from "../../../../Link";

const SignUpHeader = () => {
  return (
    <div className="mb-8 text-center">
        <Link to="/pokedex" className="inline-block">
        <Pokeball />
      </Link>
      <h1 className="text-5xl font-bold text-red-600 mb-2 text-shadow">Pokémon League</h1>
      <p className="text-black text-lg text-shadow">Official platform for trainers</p>
    </div>
  );
};

export default SignUpHeader;