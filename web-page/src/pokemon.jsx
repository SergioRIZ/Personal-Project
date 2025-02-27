import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pokemon = ({ name }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemonData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [name]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{pokemonData.name}</h2>
      <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
      <p>Altura: {pokemonData.height / 10} m</p>
      <p>Peso: {pokemonData.weight / 10} kg</p>
      <h3>Habilidades:</h3>
      <ul>
        {pokemonData.abilities.map((ability, index) => (
          <li key={index}>{ability.ability.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Pokemon;