export const getMetadataValue = <T,>(metadata: string, key: string): T | undefined => {
    try {
        const parsed = JSON.parse(metadata);
        return parsed[key] as T;
    } catch {
        return undefined;
    }
};
