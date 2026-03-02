import { navigate } from '../../../navigation';
import HeroSection from '../Pokedex/HeroSection';
import AuthLinks from '../Pokedex/AuthLinks';

const Landing = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-200 via-teal-100 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
    <AuthLinks />
    <div className="flex-1 flex flex-col justify-center">
      <HeroSection
        onExplore={() => navigate('/pokedex')}
        totalPokemon={1025}
      />
    </div>
  </div>
);

export default Landing;
