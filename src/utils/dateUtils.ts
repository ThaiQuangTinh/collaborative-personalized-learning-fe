// ---- Format: YYYY-MM-DD ----
export const formatDate = (dateInput: string | null): string => {
    if (!dateInput) return "";

    // Chỉ lấy phần ngày, bỏ toàn bộ time & timezone
    const datePart = dateInput.split("T")[0]; // YYYY-MM-DD

    const [year, month, day] = datePart.split("-");

    if (!year || !month || !day) return "";

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
export const formatDateTime = (dateInput: string | null): string => {
    if (!dateInput) return "";

    // YYYY-MM-DDTHH:mm:ss(.SSS)
    const [datePart, timePart] = dateInput.split("T");

    if (!datePart || !timePart) return "";

    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    if (!year || !month || !day || !hour || !minute) return "";

    return `${day}/${month}/${year} - ${hour}:${minute}`;
};


/**
 * Convert "YYYY-MM-DD" -> "YYYY-MM-DDTHH:MM:SS.mmmZ"
 * Giữ nguyên ngày truyền vào, nhưng dùng giờ hiện tại lúc gọi hàm.
 */
export const toTimestamp = (dateStr: string): string => {
    if (!dateStr) {
        // dùng thời điểm hiện tại nhưng giữ local
        return new Date().toISOString();
    }

    const [year, month, day] = dateStr.split("-").map(Number);

    // set 12:00 trưa local để tránh lệch ngày
    const safeDate = new Date(year, month - 1, day, 12, 0, 0, 0);

    // ⚠️ KHÔNG dùng giờ hiện tại
    return safeDate.toISOString();
};



// const dateUtils = {
//     formatDate,
//     formatTime,
//     formatDateTime
// };

// export default dateUtils;