export const Storage = {
    set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key: string) {
        const item = localStorage.getItem(key);
        try {
            return item ? JSON.parse(item) : null;
        } catch {
            return item;
        }
    },

    remove(key: string) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};
