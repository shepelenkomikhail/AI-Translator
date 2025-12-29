import {X} from "lucide-react";
import Options from "./Options.tsx";
import type {Dispatch, SetStateAction} from "react";

interface Props{
    setOpenSettings: (value: boolean) => void;
    modeToggleStyle: string;
    darkMode: boolean;
    setPrimaryLanguage: Dispatch<SetStateAction<string>>;
    setSecondaryLanguage: Dispatch<SetStateAction<string>>;
    primaryLanguage: string;
    secondaryLanguage: string;
}

export default function SettingsComponent({setOpenSettings, modeToggleStyle, darkMode, setPrimaryLanguage,
                                     primaryLanguage, setSecondaryLanguage, secondaryLanguage}: Props)
{
    return (
        <div className="flex flex-col gap-8 relative">
            <h1 className="text-start absolute top-3 left-3 text-xl">Settings</h1>
            <button onClick={() => setOpenSettings(false)}>
                <X className={`absolute right-3 top-3 ${modeToggleStyle}`}/>
            </button>

            <div className={"flex flex-col gap-2 mt-12 ml-3"}>
                <h2 className={"text-md"}>Primary language</h2>
                <Options
                    darkMode={darkMode}
                    setLanguage={setPrimaryLanguage}
                    selectedLanguage={primaryLanguage}
                    placeholder={"Primary language"}
                    isSettings={true}
                />
            </div>

            <div className={"flex flex-col gap-2 ml-3"}>
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
    );
}