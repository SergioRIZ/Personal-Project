import React, { useState } from 'react';
import Pokeball from './Components/ui/Pokeball';
import AudioSettings from './Components/AudioSettings';
import DisplaySettings from './Components/DisplaySettings';
import GameplaySettings from './Components/GameplaySettings';
import AccountSettings from './Components/AccountSettings';
import NetworkSettings from './Components/NetworkSettings';

const Settings = () => {
  // State for all settings
  const [volume, setVolume] = useState({ music: 70, sfx: 60, voices: 80 });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [expandedSections, setExpandedSections] = useState({
    audio: true,
    display: false,
    gameplay: false,
    account: false,
    network: false,
  });
  const [autoSave, setAutoSave] = useState(true);
  const [battleAnimations, setBattleAnimations] = useState(true);
  const [textSpeed, setTextSpeed] = useState(2); // 0: Slow, 1: Normal, 2: Fast
  const [difficulty, setDifficulty] = useState(1); // 0: Easy, 1: Normal, 2: Hard
  const [favoriteType, setFavoriteType] = useState('electric');

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4 pt-10">
        {/* Header with padding to prevent text cutoff */}
        <div className="min-h-[110px] mb-6">
          <div className="flex items-center justify-between">
            {/* Fixed line height and padding for title */}
            <h1 
              className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 dark:from-green-400 dark:to-blue-500 drop-shadow-md" 
              style={{ lineHeight: '1.3', paddingBottom: '20px' }}
            >
              Pokémon Settings
            </h1>
            
            {/* Pokéball decoration */}
            <div className="flex">
              <Pokeball />
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300">
          <AudioSettings 
            volume={volume} 
            setVolume={setVolume} 
            isExpanded={expandedSections.audio} 
            toggleSection={toggleSection}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300">
          <DisplaySettings 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            battleAnimations={battleAnimations}
            setBattleAnimations={setBattleAnimations}
            textSpeed={textSpeed}
            setTextSpeed={setTextSpeed}
            isExpanded={expandedSections.display}
            toggleSection={toggleSection}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300">
          <GameplaySettings 
            autoSave={autoSave}
            setAutoSave={setAutoSave}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            favoriteType={favoriteType}
            setFavoriteType={setFavoriteType}
            isExpanded={expandedSections.gameplay}
            toggleSection={toggleSection}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300">
          <AccountSettings 
            notifications={notifications}
            setNotifications={setNotifications}
            language={language}
            setLanguage={setLanguage}
            isExpanded={expandedSections.account}
            toggleSection={toggleSection}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300">
          <NetworkSettings 
            isExpanded={expandedSections.network}
            toggleSection={toggleSection}
          />
        </div>

        {/* Save & Reset Buttons */}
        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50">
            Reset to Default
          </button>
          <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;