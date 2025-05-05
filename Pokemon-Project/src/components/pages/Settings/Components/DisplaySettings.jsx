import React, { useRef, useEffect, useState } from 'react';
import { Monitor, Moon } from 'lucide-react';

const DisplaySettings = ({ 
  darkMode, 
  setDarkMode, 
  textSpeed,
  setTextSpeed,
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
        onClick={() => toggleSection('display')}
        className="flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex items-center">
          <Monitor className="w-5 h-5 mr-3 text-teal-500" />
          <span className="text-white font-normal">Display Settings</span>
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
          {/* Dark Mode Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-blue-400 flex items-center">
                <Moon className="w-4 h-4 mr-2" />
                Night Mode
              </label>
              <div 
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${darkMode ? 'bg-teal-500' : 'bg-gray-600'}`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </div>
            </div>
          </div>

          {/* Text Speed */}
          <div>
            <label className="block text-sm text-blue-400 mb-2">
              Text Speed
            </label>
            <div className="flex space-x-2">
              {['Slow', 'Normal', 'Fast'].map((speed, index) => (
                <button
                  key={speed}
                  onClick={() => setTextSpeed(index)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none ${
                    textSpeed === index 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;