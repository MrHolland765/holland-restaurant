import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  sw: { language: 'Lugha', signedInAs: 'Umeingia kama', customer: 'Mteja', admin: 'Msimamizi', delivery: 'Mtoa huduma', logout: 'Toka' },
  en: { language: 'Language', signedInAs: 'Signed in as', customer: 'Customer', admin: 'Administrator', delivery: 'Delivery staff', logout: 'Sign out' },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('holland_language') || 'sw');

  useEffect(() => {
    localStorage.setItem('holland_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => translations[language][key] || key;
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
