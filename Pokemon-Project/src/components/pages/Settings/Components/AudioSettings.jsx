import React from 'react';
import { Volume2 } from 'lucide-react';
import SettingsSection from './ui/SettingSection';

const AudioSettings = ({ volume, setVolume, isExpanded, toggleSection }) => {
  return (
    <SettingsSection 
      title="Audio Settings" 
      icon={Volume2} 
      isExpanded={isExpanded} 
      onToggle={() => toggleSection('audio')}
    >
      {/* Music Volume */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Battle Music Volume
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-gray-500">0</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume.music} 
            onChange={(e) => setVolume({...volume, music: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-gray-500">100</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Current: {volume.music}%</p>
      </div>

      {/* SFX Volume */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sound Effects Volume
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-gray-500">0</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume.sfx} 
            onChange={(e) => setVolume({...volume, sfx: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-gray-500">100</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Current: {volume.sfx}%</p>
      </div>

      {/* Voice Volume */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Voice Volume
        </label>
        <div className="flex items-center">
          <span className="mr-2 text-gray-500">0</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume.voices} 
            onChange={(e) => setVolume({...volume, voices: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-gray-500">100</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Current: {volume.voices}%</p>
      </div>
    </SettingsSection>
  );
};

export default AudioSettings;