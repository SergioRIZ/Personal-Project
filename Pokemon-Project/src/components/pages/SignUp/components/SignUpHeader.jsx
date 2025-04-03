import React from "react";
import Pokeball from "./Pokeball";
import { Link } from "../../../../Link";

const SignUpHeader = () => {
  return (
    <div className="mb-8 text-center">
      <Link to="/" className="inline-block">
        <Pokeball />
      </Link>
      <h1 className="text-5xl font-bold mb-2 text-shadow">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700">Pokémon League</span>
      </h1>
      <p className="text-black-600 text-lg text-shadow">Official platform for trainers</p>
    </div>
  );
};

export default SignUpHeader;