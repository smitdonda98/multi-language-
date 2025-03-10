import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
    en: {
        translation: {
            welcome: "Welcome",
            type_something: "Type something...",
            translated: "Translated",
            english: "English",
            french: "French",
        },
    },
    fr: {
        translation: {
            welcome: "Bienvenue",
            type_something: "Tapez quelque chose...",
            translated: "Traduit",
            english: "Anglais",
            french: "Français",
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;
