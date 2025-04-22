import React, { useRef, useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';

const AudioSettings = ({ volume, setVolume, isExpanded, toggleSection }) => {
  // Referencia al contenido que se expandirá/contraerá
  const contentRef = useRef(null);
  // Estado para la altura máxima del contenido
  const [contentHeight, setContentHeight] = useState(0);

  // Efecto para medir la altura del contenido cuando cambia isExpanded
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div className="rounded-lg mb-6 overflow-hidden bg-gray-900/60 border border-gray-800">
      {/* Encabezado de la sección - siempre visible */}
      <div 
        onClick={() => toggleSection('audio')}
        className="flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex items-center">
          <Volume2 className="w-5 h-5 mr-3 text-teal-500" />
          <span className="text-white font-normal">Audio Settings</span>
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

      {/* Contenido expandible con transición */}
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
          {/* Music Volume */}
          <div className="mb-3">
            <label className="block text-sm text-blue-400">
            Music Volume
            </label>
            <div className="flex items-center py-1">
              <span className="mr-2 text-gray-500">0</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume.music} 
                onChange={(e) => setVolume({...volume, music: parseInt(e.target.value)})}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 text-gray-500">100</span>
            </div>
            <p className="text-xs text-gray-500">Current: {volume.music}%</p>
          </div>

          {/* SFX Volume */}
          <div className="mb-3">
            <label className="block text-sm text-blue-400">
              Sound Effects Volume
            </label>
            <div className="flex items-center py-1">
              <span className="mr-2 text-gray-500">0</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume.sfx} 
                onChange={(e) => setVolume({...volume, sfx: parseInt(e.target.value)})}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 text-gray-500">100</span>
            </div>
            <p className="text-xs text-gray-500">Current: {volume.sfx}%</p>
          </div>

          {/* Voice Volume */}
          <div>
            <label className="block text-sm text-blue-400">
              Voice Volume
            </label>
            <div className="flex items-center py-1">
              <span className="mr-2 text-gray-500">0</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume.voices} 
                onChange={(e) => setVolume({...volume, voices: parseInt(e.target.value)})}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 text-gray-500">100</span>
            </div>
            <p className="text-xs text-gray-500">Current: {volume.voices}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSettings;