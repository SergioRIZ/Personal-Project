import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, LogOut } from 'lucide-react';
import SettingsSection from './ui/SettingSection';
import { useAuth } from '../../../../context/AuthContext';
import { signOut } from '../../../../lib/auth';
import { navigate } from '../../../../navigation';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
}

const AccountSettings = ({ isExpanded, onToggle }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <SettingsSection
      title={t('account_title')}
      icon={User}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {user ? (
        <>
          {/* Signed in state */}
          <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg select-none">
              {user.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('account_signed_in_as')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200 text-sm font-medium cursor-pointer"
            >
              <LogOut size={16} />
              {t('account_sign_out')}
            </button>
          </div>
        </>
      ) : (
        /* Signed out state */
        <div className="py-3 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('account_not_signed_in')}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
          >
            {t('account_sign_in')}
          </button>
        </div>
      )}
    </SettingsSection>
  );
};

export default AccountSettings;
