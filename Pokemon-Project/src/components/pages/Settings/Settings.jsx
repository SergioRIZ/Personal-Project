import React, { useState } from 'react';
import Pokeball from './Components/ui/Pokeball';
import AudioSettings from './Components/AudioSettings';
import DisplaySettings from './Components/DisplaySettings';
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

  const [battleAnimations, setBattleAnimations] = useState(true);
  const [textSpeed, setTextSpeed] = useState(2); // 0: Slow, 1: Normal, 2: Fast


  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900 flex justify-center items-center transition-colors duration-300">
      <div className="container max-w-4xl mx-auto px-6">
        {/* Main content card without border */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Pokeball */}
          <div className="bg-gradient-to-r from-green-50 to-slate-100 dark:from-gray-700 dark:to-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 
                className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 dark:from-green-400 dark:to-blue-500 drop-shadow-md" 
                style={{ lineHeight: '1.3' }}
              >
                Pokémon Settings
              </h1>
              
              {/* Pokéball decoration */}
              <div className="flex">
                <Pokeball />
              </div>
            </div>
          </div>

          {/* Settings Sections Container */}
          <div className="p-6">
            <div className="mb-4">
              <AudioSettings 
                volume={volume} 
                setVolume={setVolume} 
                isExpanded={expandedSections.audio} 
                toggleSection={toggleSection}
              />
            </div>
            
            <div className="mb-4">
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
            
            <div className="mb-4">
              <AccountSettings 
                notifications={notifications}
                setNotifications={setNotifications}
                language={language}
                setLanguage={setLanguage}
                isExpanded={expandedSections.account}
                toggleSection={toggleSection}
              />
            </div>
            
            <div className="mb-4">
              <NetworkSettings 
                isExpanded={expandedSections.network}
                toggleSection={toggleSection}
              />
            </div>

            {/* Save & Reset Buttons */}
            <div className="flex justify-center space-x-4 mt-8 pb-2">
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg border border-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Reset to Default
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;