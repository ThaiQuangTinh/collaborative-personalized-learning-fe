// Validate phone number Viet Nam
// Hỗ trợ các đầu số hợp lệ hiện nay: 03, 05, 07, 08, 09
// Định dạng: 10 số, không ký tự đặc biệt

export const isValidVietnamPhoneNumber = (phone: string): boolean => {
    if (!phone) return false;

    // Loại bỏ khoảng trắng, dấu gạch, dấu chấm,...
    const cleaned = phone.replace(/[\s.-]/g, "");

    // Regex theo quy chuẩn VN (10 số)
    const vietnamPhoneRegex = /^(03|05|07|08|09)\d{8}$/;

    return vietnamPhoneRegex.test(cleaned);
};