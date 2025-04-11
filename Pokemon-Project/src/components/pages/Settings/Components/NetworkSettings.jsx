import React from 'react';
import { Database } from 'lucide-react';
import SettingsSection from './ui/SettingSection';

const NetworkSettings = ({ isExpanded, toggleSection }) => {
  return (
    <SettingsSection 
      title="Network Settings" 
      icon={Database} 
      isExpanded={isExpanded} 
      onToggle={() => toggleSection('network')}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Connect to Global Trade System
          </label>
          <button className="w-12 h-6 rounded-full p-1 bg-blue-500">
            <div className="bg-white w-4 h-4 rounded-full transform translate-x-6"></div>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Download Updates Automatically
          </label>
          <button className="w-12 h-6 rounded-full p-1 bg-blue-500">
            <div className="bg-white w-4 h-4 rounded-full transform translate-x-6"></div>
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Mystery Gift Notifications
          </label>
          <button className="w-12 h-6 rounded-full p-1 bg-blue-500">
            <div className="bg-white w-4 h-4 rounded-full transform translate-x-6"></div>
          </button>
        </div>
      </div>
    </SettingsSection>
  );
};

export default NetworkSettings;