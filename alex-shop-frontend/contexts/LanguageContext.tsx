"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "ja" | "en" | "zh";

type LanguageContextType = {
    lang: Lang;
    setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType>({
    lang: "ja",
    setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>("ja");

    useEffect(() => {
        const saved = localStorage.getItem("lang") as Lang;
        if (saved) setLangState(saved);
    }, []);

    const setLang = (l: Lang) => {
        setLangState(l);
        localStorage.setItem("lang", l);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
