import React, { createContext, useEffect, useState } from 'react';
import { IChildren } from "../types";

// etape  1  : définir le type des élements qu'on souhaite partager
interface ThemeProviderProps{
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// etape 2 : créer le contexte et l'initialiser avec ces élements ou pas 
export const ThemeContext = createContext<ThemeProviderProps | undefined>(undefined);


// etapes 3 créer le provider pour partager la data que l'on souhaite
export const ThemeContextProvider: React.FC<IChildren> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };


    useEffect(() => {
        localStorage.setItem('theme',theme)
    },[theme])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}