import React, { useRef, useEffect, useState } from 'react';
import { Database } from 'lucide-react';

const NetworkSettings = ({ 
  connectedToGTS = true,
  setConnectedToGTS = () => {},
  autoUpdate = true,
  setAutoUpdate = () => {},
  mysteryGiftNotifications = true,
  setMysteryGiftNotifications = () => {},
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
        onClick={() => toggleSection('network')}
        className="flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex items-center">
          <Database className="w-5 h-5 mr-3 text-teal-500" />
          <span className="text-white font-normal">Network Settings</span>
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
          {/* Global Trade System Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-blue-400">
                Connect to Global Trade System
              </label>
              <div 
                onClick={() => setConnectedToGTS(!connectedToGTS)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${connectedToGTS ? 'bg-teal-500' : 'bg-gray-600'}`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${connectedToGTS ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </div>
            </div>
          </div>

          {/* Auto Updates Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-blue-400">
                Download Updates Automatically
              </label>
              <div 
                onClick={() => setAutoUpdate(!autoUpdate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${autoUpdate ? 'bg-teal-500' : 'bg-gray-600'}`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${autoUpdate ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </div>
            </div>
          </div>

          {/* Mystery Gift Notifications */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-blue-400">
                Mystery Gift Notifications
              </label>
              <div 
                onClick={() => setMysteryGiftNotifications(!mysteryGiftNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${mysteryGiftNotifications ? 'bg-teal-500' : 'bg-gray-600'}`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${mysteryGiftNotifications ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSettings;