import React from 'react';

interface Props {
  isEnabled: boolean;
  onToggle: () => void;
}

const ToggleSwitch = ({ isEnabled, onToggle }: Props) => (
  <button
    onClick={onToggle}
    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 transform hover:scale-105 ${isEnabled ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

export default ToggleSwitch;
