import React from 'react';
import { Monitor, Moon } from 'lucide-react';
import SettingsSection from './ui/SettingSection';
import ToggleSwitch from './ui/ToggleSwitch';

const DisplaySettings = ({ 
  darkMode, 
  setDarkMode, 
  battleAnimations, 
  setBattleAnimations,
  textSpeed,
  setTextSpeed,
  isExpanded, 
  toggleSection 
}) => {
  return (
    <SettingsSection 
      title="Display Settings" 
      icon={Monitor} 
      isExpanded={isExpanded} 
      onToggle={() => toggleSection('display')}
    >
      {/* Dark Mode Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Moon size={16} className="mr-2" />
            Night Mode
          </label>
          <ToggleSwitch 
            isEnabled={darkMode} 
            onToggle={() => setDarkMode(!darkMode)} 
          />
        </div>
      </div>

      {/* Battle Animations */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Battle Animations
          </label>
          <ToggleSwitch 
            isEnabled={battleAnimations} 
            onToggle={() => setBattleAnimations(!battleAnimations)} 
          />
        </div>
      </div>

      {/* Text Speed */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Speed
        </label>
        <div className="flex space-x-2">
          {['Slow', 'Normal', 'Fast'].map((speed, index) => (
            <button
              key={speed}
              onClick={() => setTextSpeed(index)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none ${
                textSpeed === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
};

export default DisplaySettings;