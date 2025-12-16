export const isNumber = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    const str = String(value).trim();
    return str !== '' && !isNaN(Number(str));
};
