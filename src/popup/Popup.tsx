import {useEffect, useState, useRef} from 'react'
import OpenAI from "openai"
import {Moon, Settings, Sun, Clipboard, X, ClipboardCheck} from 'lucide-react';
import Options from "./Options.tsx";
import {API_KEY} from "./api.ts";

export default function Popup() {
    const [inputText, setInputText] = useState('')
    const [translatedText, setTranslatedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    // @ts-ignore
    const typingTimeoutRef = useRef<NodeJS.Timeout>()

    const [sourceLanguage, setSourceLanguage] = useState('Auto-detect')
    const [targetLanguage, setTargetLanguage] = useState('Auto-detect')

    const [primaryLanguage, setPrimaryLanguage] = useState(localStorage.getItem('primaryLanguage') || 'Russian')
    const [secondaryLanguage, setSecondaryLanguage] = useState(localStorage.getItem('secondaryLanguage') || 'English')

    const [translatedWords, setTranslatedWords] = useState('')
    const [, setTranslatedTranscription] = useState('')

    const [textToDisplay, setTextToDisplay] = useState('')

    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        if (!translatedText) return;

        try {
            const parsed = JSON.parse(translatedText);
            const translation = parsed.translation || translatedText;
            const transcription = parsed.transcription || '';

            setTranslatedWords(translation);
            setTranslatedTranscription(transcription);
            setTextToDisplay(transcription ? `${translation} \n\n${transcription}` : translation);
        } catch (error) {
            console.warn('Failed to parse JSON response:', error);
            setTranslatedWords(translatedText);
            setTranslatedTranscription('');
            setTextToDisplay(translatedText);
        }
    }, [translatedText]);

    useEffect(() => {
        localStorage.setItem('primaryLanguage', primaryLanguage)
        localStorage.setItem('secondaryLanguage', secondaryLanguage)
    }, [primaryLanguage, secondaryLanguage])

    const [isLoading, setIsLoading] = useState(false)
    const [darkMode, setDarkMode] = useState(true)
    const [openSettings, setOpenSettings] = useState(false)

    const textAreaStyle = `relative resize-none w-full h-[105px] flex-1 border border-gray-600 
                           outline-none overflow-y-auto p-2 pt-8 rounded-lg text-[0.85rem]
                           ${darkMode ? 'focus:border-blue-300' : 'focus:border-blue-800'}
                           ${darkMode ? 'text-[rgb(238,238,238)]' : 'text-[rgb(22,24,31)]'}
                           `
    const modeToggleStyle = `hover:cursor-pointer hover:scale-103 transition-all duration-50`

    const client = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
        setIsTyping(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            if (inputText.trim() !== '') {
                handleTranslate();
            }
        }, 1000);
    }

    const handleTranslateSecondWindow = () => {
        if (inputText.trim() === '') {
            setTranslatedText('');
            return;
        }
        handleTranslate();
    }

    const handleTranslate = async () => {
        if (!inputText.trim() || !sourceLanguage || !targetLanguage) {
            console.log('Missing required fields:', { inputText: !!inputText.trim(), sourceLanguage, targetLanguage });
            return;
        }

        setIsLoading(true);
        try {
            let sourceLanguageAI: string;
            let targetLanguageAI: string;

            if (sourceLanguage === "Auto-detect" && targetLanguage === "Auto-detect") {
                sourceLanguageAI = "auto";
                targetLanguageAI = "auto";
            } else if (sourceLanguage === "Auto-detect") {
                sourceLanguageAI = "auto";
                targetLanguageAI = targetLanguage;
            } else if (targetLanguage === "Auto-detect") {
                sourceLanguageAI = sourceLanguage;
                targetLanguageAI = secondaryLanguage;
            } else {
                sourceLanguageAI = sourceLanguage;
                targetLanguageAI = targetLanguage;
            }

            if (sourceLanguageAI !== "auto" && targetLanguageAI !== "auto" && sourceLanguageAI === targetLanguageAI) {
                targetLanguageAI = (targetLanguageAI === primaryLanguage) ? secondaryLanguage : primaryLanguage;
            }

            let prompt: string;

            if (sourceLanguageAI === "auto" && targetLanguageAI === "auto") {
                prompt = `Detect the language of the following text and translate it intelligently:
                        - If the text is in ${primaryLanguage}, translate it to ${secondaryLanguage}
                        - If the text is in ${secondaryLanguage}, translate it to ${primaryLanguage}
                        - If the text is in any other language, translate it to ${secondaryLanguage}

                        Return only the translation and transcription of translated text in form /transcription/, no additional text.
                        Response should be in json format. e.g. {"translation": "translated text", "transcription": "/transcription/"}.
                        If there are less than 3 words in the text, return only the translation.
                        Text to translate: \n\n${inputText}`;
            } else if (sourceLanguageAI === "auto") {
                prompt = `Translate the following text to ${targetLanguageAI}.
                        Return only the translation and transcription of translated text in form /transcription/, no additional text.
                        Response should be in json format. e.g. {"translation": "translated text", "transcription": "/transcription/"}.
                        If there are less than 3 words in the text, return only the translation.
                        Text to translate: \n\n${inputText}`;
            } else {
                prompt = `Translate the following text from ${sourceLanguageAI} to ${targetLanguageAI}.
                        Return only the translation and transcription of translated text in form /transcription/, no additional text.
                        Response should be in json format. e.g. {"translation": "translated text", "transcription": "/transcription/"}.
                        If there are less than 3 words in the text, return only the translation.
                        Text to translate: \n\n${inputText}`;
            }

            const response = await client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
            });

            console.log(prompt)
            console.log(response.choices[0]?.message?.content)

            const translation = response.choices[0]?.message?.content?.trim() || '';
            setTranslatedText(translation);
        } catch (error) {
            console.error('Translation error:', error);
            setTranslatedText('Translation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleClipboardClick = () => {
        navigator.clipboard.writeText(translatedWords);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <div className={`flex flex-col gap-3 p-4 border border-0 shadow-xl rounded-lg  h-[300px] 
                    ${darkMode ? 'bg-[rgb(22,24,31)]' : 'bg-[rgb(238,238,238)]'}
                    ${darkMode ? 'text-[rgb(238,238,238)]' : 'text-[rgb(22,24,31)]'}
                `}
            >
                {
                    openSettings ? (
                        <div className={"flex flex-col gap-8"}>
                            <h1 className={"text-start absolute top-3 left-3 text-xl"}>Settings</h1>

                            <button onClick={() => setOpenSettings(!openSettings)}>
                                <X className={`absolute right-3 top-3 ${modeToggleStyle}`}/>
                            </button>

                            <div className={"flex flex-col gap-2 mt-6"}>
                                <h2 className={"text-md"}>Primary language</h2>
                                <Options
                                    darkMode={darkMode}
                                    setLanguage={setPrimaryLanguage}
                                    selectedLanguage={primaryLanguage}
                                    placeholder={"Primary language"}
                                    isSettings={true}
                                />
                            </div>

                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-md"}>Secondary language</h2>
                                <Options
                                    darkMode={darkMode}
                                    setLanguage={setSecondaryLanguage}
                                    selectedLanguage={secondaryLanguage}
                                    placeholder={"Secondary language"}
                                    isSettings={true}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={`flex w-full relative `}>
                                <h1 className={"text-center font-bold text-xl"}>AI Translator</h1>
                                <div className={"flex items-center justify-center absolute right-0 gap-3 "}>
                                    <button>
                                        {
                                            (darkMode) ?
                                                <Moon size={20} className={modeToggleStyle} onClick={() => setDarkMode(!darkMode)} />
                                                :
                                                <Sun size={20} className={modeToggleStyle} onClick={() => setDarkMode(!darkMode)} />
                                        }
                                    </button>
                                    <button>
                                        <Settings size={20} className={modeToggleStyle} onClick={() => setOpenSettings(!openSettings)} />
                                    </button>
                                </div>
                            </div>

                            <div className={"flex flex-col gap-2"}>
                                <div className="relative">
                                    <textarea
                                        className={textAreaStyle}
                                        value={inputText}
                                        onChange={handleInputChange}
                                        placeholder={isTyping ? "Typing..." : 'Enter text to translate...'}
                                    />
                                    <Options
                                        darkMode={darkMode}
                                        setLanguage={(language) => setSourceLanguage(language)}
                                        selectedLanguage={sourceLanguage}
                                        isSettings={false}
                                    />
                                    {(!isCopied) ? (
                                        <Clipboard size={16} className={`${modeToggleStyle} absolute right-1 top-2 text-gray-600`} onClick={handleClipboardClick} />
                                    ) : (
                                        <ClipboardCheck size={16} className={`${modeToggleStyle} absolute right-1 top-2 text-gray-600`}/>
                                    )}

                                </div>

                                <div className="relative">
                                    <textarea
                                        className={textAreaStyle}
                                        value={textToDisplay}
                                        onChange={(e) => setTranslatedText(e.target.value)}
                                        placeholder={isLoading ? "Loading..." : 'Translated text will be here!'}
                                        readOnly
                                    />
                                    <Options
                                        darkMode={darkMode}
                                        setLanguage={(language) => setTargetLanguage(language)}
                                        selectedLanguage={targetLanguage}
                                        isSettings={false}
                                        onLanguageChange={handleTranslateSecondWindow}
                                    />
                                    {(!isCopied) ? (
                                        <Clipboard size={16} className={`${modeToggleStyle} absolute right-1 top-2 text-gray-600`} onClick={handleClipboardClick} />
                                    ) : (
                                        <ClipboardCheck size={16} className={`${modeToggleStyle} absolute right-1 top-2 text-gray-600`}/>
                                    )}
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
}