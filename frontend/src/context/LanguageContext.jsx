import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    search: 'Search for products...',
    cart: 'Bag',
    login: 'Login',
    logout: 'Logout',
    allCategories: 'All',
    shopByCategory: 'Shop by Category',
  },
  hi: {
    search: 'प्रोडक्ट खोजें...',
    cart: 'कार्ट',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    allCategories: 'सभी',
    shopByCategory: 'श्रेणी अनुसार खरीदें',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}