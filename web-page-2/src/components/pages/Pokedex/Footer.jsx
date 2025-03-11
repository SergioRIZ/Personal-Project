import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="mt-12 text-center text-gray-600 text-sm">
      <p>{t('dataProvided')} <span className="font-medium">PokéAPI</span></p>
    </footer>
  );
};

export default Footer;