import React, { useRef, useEffect, useState } from 'react';
import { Users, Bell, Globe } from 'lucide-react';

const AccountSettings = ({ 
  notifications, 
  setNotifications,
  language,
  setLanguage,
  isExpanded, 
  toggleSection 
}) => {
  // Reference to the content that will expand/contract
  const contentRef = useRef(null);
  // State for the maximum height of the content
  const [contentHeight, setContentHeight] = useState(0);

  // Effect to measure the content height when isExpanded changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div className="rounded-lg mb-6 overflow-hidden bg-gray-900/60 border border-gray-800">
      {/* Section header - always visible */}
      <div 
        onClick={() => toggleSection('account')}
        className="flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-3 text-teal-500" />
          <span className="text-white font-normal">Account Settings</span>
        </div>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expandable content with transition */}
      <div 
        ref={contentRef}
        style={{ 
          maxHeight: `${contentHeight}px`,
          transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden'
        }}
      >
        <div className="p-4">
          {/* Notifications Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-blue-400 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Pokémon Center Notifications
              </label>
              <div 
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${notifications ? 'bg-teal-500' : 'bg-gray-600'}`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${notifications ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-4">
            <label className="text-sm text-blue-400 mb-1 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Game Language
            </label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:border-teal-500"
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
          <div className="mb-2 p-3 bg-gray-800/50 rounded-md border border-gray-700">
            <h3 className="text-sm text-blue-400 mb-2">Trainer Card</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Trainer ID</span>
              <span className="text-xs font-medium text-gray-300">25814</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Pokédex Completion</span>
              <span className="text-xs font-medium text-gray-300">147/151</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Account Level</span>
              <div className="flex items-center">
                <span className="text-xs font-medium mr-1 text-gray-300">42</span>
                <div className="w-20 h-2 bg-gray-700 rounded-full">
                  <div className="h-2 bg-teal-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;