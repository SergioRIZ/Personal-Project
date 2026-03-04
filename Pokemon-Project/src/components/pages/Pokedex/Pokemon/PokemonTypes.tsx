import { translateType, getTypeSpriteUrl } from '../utils';

interface PokemonTypeEntry {
  type: { name: string };
}

interface Props {
  types: PokemonTypeEntry[];
  currentLanguage: string;
}

const PokemonTypes = ({ types, currentLanguage }: Props) => (
  <div className="flex flex-wrap gap-20 justify-center items-center">
    {types.map(({ type }) => (
      <img
        key={type.name}
        src={getTypeSpriteUrl(type.name)}
        alt={translateType(type.name, currentLanguage)}
        title={translateType(type.name, currentLanguage)}
        className="w-20 h-20 object-contain drop-shadow-lg hover:scale-110 transition-transform duration-200 "
      />
    ))}
  </div>
);

export default PokemonTypes;
