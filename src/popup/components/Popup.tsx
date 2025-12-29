import {useEffect, useState, type ChangeEvent} from 'react'
import {Moon, Settings, Sun, Clipboard, ClipboardCheck} from 'lucide-react';
import Options from "./Options.tsx";
import SettingsComponent from "./SettingsComponent.tsx";
import * as React from "react";
import type {TranslateRequest} from "../../shared/types.ts";
import {parseTranslation} from "../../shared/parser.ts";

const modeToggleStyle = `hover:cursor-pointer hover:scale-103 transition-all duration-50`

export default function Popup() {
    const [inputText, setInputText] = useState('')
    const [, setTranslatedText] = useState('')
    const [sourceLanguage, setSourceLanguage] = useState('Auto-detect')
    const [targetLanguage, setTargetLanguage] = useState('Auto-detect')
    const [primaryLanguage, setPrimaryLanguage] = useState(localStorage.getItem('primaryLanguage') || 'Russian')
    const [secondaryLanguage, setSecondaryLanguage] = useState(localStorage.getItem('secondaryLanguage') || 'English')
    const [translatedWords, ] = useState('')
    const [textToDisplay, setTextToDisplay] = useState('')
    const [isCopied, setIsCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [darkMode, setDarkMode] = useState(true)
    const [openSettings, setOpenSettings] = useState(false)

    const textAreaStyle = `relative resize-none w-full h-[105px] flex-1 border border-gray-600 
                           outline-none overflow-y-auto p-2 pt-8 rounded-lg text-[0.85rem]
                           ${darkMode ? 'focus:border-blue-300' : 'focus:border-blue-800'}
                           ${darkMode ? 'text-[rgb(238,238,238)]' : 'text-[rgb(22,24,31)]'}
                           `

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTranslate().then();
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
    }

    const handleTranslate = async () => {
        if (!inputText.trim() || !sourceLanguage || !targetLanguage) return;

        setIsLoading(true);
        const payload: TranslateRequest = {
            inputText,
            sourceLanguage,
            targetLanguage,
            primaryLanguage,
            secondaryLanguage,
        };

        chrome.runtime.sendMessage(
            { type: "TRANSLATE", payload },
            (response) => {
                if (response?.text) {
                    setTranslatedText(response.text);
                    setTextToDisplay(parseTranslation(response.text));
                } else {
                    setTranslatedText("Translation failed.");
                }
                setIsLoading(false);
            }
        );
    }

    const handleClipboardClick = () => {
        navigator.clipboard.writeText(translatedWords).then();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    useEffect(() => {
        localStorage.setItem('primaryLanguage', primaryLanguage)
        localStorage.setItem('secondaryLanguage', secondaryLanguage)
    }, [primaryLanguage, secondaryLanguage])

    return (
        <>
            <div className={`flex flex-col gap-3 p-4 shadow-xl rounded-lg h-[340px] w-[350px]
                ${darkMode ? 'bg-[rgb(22,24,31)]' : 'bg-[rgb(238,238,238)]'}
                ${darkMode ? 'text-[rgb(238,238,238)]' : 'text-[rgb(22,24,31)]'}
            `}>
                {openSettings ? (
                    <SettingsComponent
                        setSecondaryLanguage={setSecondaryLanguage}
                        secondaryLanguage={secondaryLanguage}
                        setPrimaryLanguage={setPrimaryLanguage}
                        primaryLanguage={primaryLanguage}
                        darkMode={darkMode}
                        modeToggleStyle={modeToggleStyle}
                        setOpenSettings={setOpenSettings}
                    />
                ) : (
                    <>
                        <div className="flex w-full relative">
                            <h1 className="text-center font-bold text-xl">AI Translator</h1>
                            <div className="flex items-center absolute right-0 gap-3">
                                {darkMode
                                    ? <Moon size={20} className={modeToggleStyle} onClick={() => setDarkMode(false)}/>
                                    : <Sun size={20} className={modeToggleStyle} onClick={() => setDarkMode(true)}/>
                                }
                                <Settings size={20} className={modeToggleStyle}
                                          onClick={() => setOpenSettings(true)}/>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <Options
                                    darkMode={darkMode}
                                    setLanguage={setSourceLanguage}
                                    selectedLanguage={sourceLanguage}
                                    isSettings={false}
                                />
                                <textarea
                                    className={textAreaStyle}
                                    value={inputText}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder={'Enter text to translate...'}
                                />
                            </div>

                            <div className="relative">
                                <Options
                                    darkMode={darkMode}
                                    setLanguage={setTargetLanguage}
                                    selectedLanguage={targetLanguage}
                                    isSettings={false}
                                />
                                <textarea
                                    className={textAreaStyle}
                                    value={textToDisplay}
                                    readOnly
                                    placeholder={isLoading ? "Loading..." : 'Translated text will be here!'}
                                />

                                {!isCopied
                                    ? <Clipboard size={16} className={`${modeToggleStyle} absolute right-1 top-2`}
                                                 onClick={handleClipboardClick}/>
                                    : <ClipboardCheck size={16}
                                                      className={`${modeToggleStyle} absolute right-1 top-2`}/>
                                }

                                <button
                                    onClick={handleTranslate}
                                    disabled={isLoading || !inputText.trim()}
                                    className={`w-full py-2 rounded-lg font-semibold cursor-pointer
                                    ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
                                `}
                                >
                                    {isLoading ? 'Translating...' : 'Translate'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
