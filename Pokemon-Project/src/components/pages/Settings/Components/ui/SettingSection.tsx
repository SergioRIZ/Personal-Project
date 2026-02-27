import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  title: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SettingsSection = ({ title, icon: Icon, isExpanded, onToggle, children }: Props) => (
  <div className="transition-all duration-300">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-slate-100 dark:from-gray-700 dark:to-gray-800 rounded-lg focus:outline-none hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center">
        {Icon && <Icon className="mr-2 text-green-600 dark:text-green-400" size={20} />}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
      </div>
      {isExpanded
        ? <ChevronUp size={20} className="text-gray-600 dark:text-gray-400" />
        : <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />}
    </button>
    {isExpanded && (
      <div className="p-4 mt-2 bg-white dark:bg-gray-800 rounded-lg transition-colors duration-300">
        {children}
      </div>
    )}
  </div>
);

export default SettingsSection;
