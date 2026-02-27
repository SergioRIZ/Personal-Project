import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import i18n from '../i18n';

export interface AppSettings {
  darkMode: boolean;
  language: 'es' | 'en';
  generations: number[];   // empty = all generations
  resultsLimit: number | null; // null = unlimited
}

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  language: 'es',
  generations: [],
  resultsLimit: null,
};

export const GENERATION_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  // Store as Partial so old localStorage shapes (missing keys) are handled gracefully
  const [storedSettings, setStoredSettings] = useLocalStorage<Partial<AppSettings>>(
    'pokemon-settings',
    DEFAULT_SETTINGS
  );

  // Always merge with defaults — guards against stale/old localStorage data
  const settings: AppSettings = { ...DEFAULT_SETTINGS, ...storedSettings };

  // Apply dark mode immediately on mount and whenever it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  // Apply language immediately on mount and whenever it changes
  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    // Apply dark mode synchronously — don't wait for the React re-render cycle.
    if (key === 'darkMode') {
      document.documentElement.classList.toggle('dark', value as boolean);
    }
    setStoredSettings(prev => ({ ...DEFAULT_SETTINGS, ...prev, [key]: value }));
  };

  const resetSettings = () => {
    document.documentElement.classList.toggle('dark', DEFAULT_SETTINGS.darkMode);
    setStoredSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
