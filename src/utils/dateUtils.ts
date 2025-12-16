// ---- Format: YYYY-MM-DD ----
export const formatDate = (dateInput: string | Date | null): string => {
    if (!dateInput) return "";

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}/${month}/${year}`;
};

// ---- Format: HH:mm:ss ----
export const formatTime = (dateInput: string | Date | null): string => {
    if (!dateInput) return "";

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
};

// ---- Combine: DD/MM/YYYY - HH:mm:ss ----
export const formatDateTime = (dateInput: string | Date | null): string => {
    const d = formatDate(dateInput);
    const t = formatTime(dateInput);
    return d && t ? `${d} - ${t}` : "";
};

/**
 * Convert "YYYY-MM-DD" -> "YYYY-MM-DDTHH:MM:SS.mmmZ"
 * Giữ nguyên ngày truyền vào, nhưng dùng giờ hiện tại lúc gọi hàm.
 */
export const toTimestamp = (dateStr: string): string => {
    // Nếu dateStr rỗng → dùng current datetime
    if (!dateStr) {
        return new Date().toISOString();
    }

    const [year, month, day] = dateStr.split("-").map(Number);

    const now = new Date();

    const result = new Date(
        year,
        month - 1,
        day,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
    );

    return result.toISOString();
};


// const dateUtils = {
//     formatDate,
//     formatTime,
//     formatDateTime
// };

// export default dateUtils;