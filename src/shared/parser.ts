export function parseTranslation(raw: string) {
    try {
        const parsed = JSON.parse(raw);
        const translation = parsed.translation?.trim() ?? raw;
        const transcription = parsed.transcription?.trim() ?? "";

        return transcription
            ? `${translation}\n\n${transcription}`
            : translation;
    } catch {
        return raw;
    }
}