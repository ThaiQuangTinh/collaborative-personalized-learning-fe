// Hàm utility để generate ID
export const generateId = (): string => {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};