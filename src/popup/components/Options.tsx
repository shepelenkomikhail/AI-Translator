import {languages} from "../languages.ts";
import * as React from "react";

interface OptionsProps {
    darkMode: boolean;
    isSettings: boolean;
    setLanguage: (language: string) => void;
    selectedLanguage: string;
    placeholder?: string;
    onLanguageChange?: () => void;
}

export default function Options({darkMode, isSettings, setLanguage, selectedLanguage, placeholder = "Select a language", onLanguageChange}: OptionsProps) {
    const optionsDivStyle = `absolute left-1 top-2 border border-gray-600 outline-none rounded-md w-[140px] text-[0.75rem] font-normal ${darkMode ? 'bg-[rgb(22,24,31)]' : 'bg-[rgb(238,238,238)]'}`
    const settingsDivStyle = `border border-gray-600 outline-none rounded-md w-[140px] text-[0.75rem] font-normal ${darkMode ? 'bg-[rgb(22,24,31)]' : 'bg-[rgb(238,238,238)]'}`

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
        if (onLanguageChange) {
            onLanguageChange();
        }
    };

    return (
        <select
            className={isSettings ? settingsDivStyle : optionsDivStyle}
            value={selectedLanguage}
            onChange={handleSelectChange}
        >
            <option value="">{placeholder}</option>
            {languages.map((language) => (
                <option key={language} value={language}>
                    {language}
                </option>
            ))}
        </select>
    );
}