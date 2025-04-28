function normalizeStr(str: string) {
    return (
        str
            .normalize("NFD")
            // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, "")
            .toLowerCase()
    );
}

export function fuzzyIncludes(haystack: string, needle: string) {
    return normalizeStr(haystack).includes(normalizeStr(needle));
}
