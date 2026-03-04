import { navigate } from '../../../navigation';
import HeroSection from '../Pokedex/HeroSection';
import AuthLinks from '../Pokedex/AuthLinks';

const Landing = () => (
  <div className="relative">
    <AuthLinks />
    <HeroSection onExplore={() => navigate('/pokedex')} totalPokemon={1025} />
  </div>
);

export default Landing;
