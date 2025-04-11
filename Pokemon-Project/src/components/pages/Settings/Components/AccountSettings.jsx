import React from 'react';
import { Users, Bell, Globe } from 'lucide-react';
import SettingsSection from './ui/SettingSection';
import ToggleSwitch from './ui/ToggleSwitch';

const AccountSettings = ({ 
  notifications, 
  setNotifications,
  language,
  setLanguage,
  isExpanded, 
  toggleSection 
}) => {
  return (
    <SettingsSection 
      title="Account Settings" 
      icon={Users} 
      isExpanded={isExpanded} 
      onToggle={() => toggleSection('account')}
    >
      {/* Notifications Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Bell size={16} className="mr-2" />
            Pokémon Center Notifications
          </label>
          <ToggleSwitch 
            isEnabled={notifications} 
            onToggle={() => setNotifications(!notifications)} 
          />
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <Globe size={16} className="mr-2" />
          Game Language
        </label>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="jp">Japanese</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {/* Profile Info */}
      <div className="mb-2 p-3 bg-gray-100 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Trainer Card</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600">Trainer ID</span>
          <span className="text-xs font-medium">25814</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600">Pokédex Completion</span>
          <span className="text-xs font-medium">147/151</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Account Level</span>
          <div className="flex items-center">
            <span className="text-xs font-medium mr-1">42</span>
            <div className="w-20 h-2 bg-gray-300 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AccountSettings;