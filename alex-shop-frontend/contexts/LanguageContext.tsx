"use client";

import { createContext, useContext, useState } from "react";

export type Lang = "ja" | "en" | "zh";

const VALID_LANGS: Lang[] = ["ja", "en", "zh"];

type LanguageContextType = {
    lang: Lang;
    setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType>({
    lang: "ja",
    setLang: () => {},
});

export function LanguageProvider({
    children,
    initialLang = "ja",
}: {
    children: React.ReactNode;
    initialLang?: Lang;
}) {
    const [lang, setLangState] = useState<Lang>(initialLang);

    const setLang = (l: Lang) => {
        setLangState(l);
        document.cookie = `lang=${l}; path=/; max-age=31536000`;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
