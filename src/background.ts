import OpenAI from "openai";
import type {TranslateRequest} from "./shared/types.ts";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === "TRANSLATE") {
        handleTranslate(message.payload)
            .then(result => sendResponse({ text: result }))
            .catch(err => sendResponse({ error: err.message }));

        return true;
    }
});

async function handleTranslate(data: TranslateRequest): Promise<string> {
    const {
        inputText,
        sourceLanguage,
        targetLanguage,
        primaryLanguage,
        secondaryLanguage,
    } = data;

    const isSourceAuto = sourceLanguage === "Auto-detect";
    const isTargetAuto = targetLanguage === "Auto-detect";

    const sourceLanguageAI = isSourceAuto ? "auto" : sourceLanguage;
    let targetLanguageAI = isTargetAuto
        ? isSourceAuto ? "auto" : secondaryLanguage
        : targetLanguage;

    if (
        sourceLanguageAI !== "auto" &&
        targetLanguageAI !== "auto" &&
        sourceLanguageAI === targetLanguageAI
    ) {
        targetLanguageAI =
            targetLanguageAI === primaryLanguage
                ? secondaryLanguage
                : primaryLanguage;
    }

    const baseRules =
        `Return only JSON: {"translation":"...","transcription":"/.../"}. ` +
        `If there are more than 3 words, return only translation.`;

    const prompt =
        sourceLanguageAI === "auto" && targetLanguageAI === "auto"
            ? `Detect the language and translate intelligently:
         - ${primaryLanguage} → ${secondaryLanguage}
         - ${secondaryLanguage} → ${primaryLanguage}
         ${baseRules}
         Text: ${inputText}`
            : sourceLanguageAI === "auto"
                ? `Translate to ${targetLanguageAI}.
           ${baseRules}
           Text: ${inputText}`
                : `Translate from ${sourceLanguageAI} to ${targetLanguageAI}.
           ${baseRules}
           Text: ${inputText}`;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content?.trim() ?? "";
}