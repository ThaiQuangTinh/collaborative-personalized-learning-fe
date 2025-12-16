const ERROR_MESSAGES_VI = {
    // ---- AUTH ----
    USERNAME_ALREADY_EXISTS: "Tên người dùng đã tồn tại!",
    EMAIL_ALREADY_EXISTS: "Email đã được sử dụng!",
    INVALID_EMAIL_FORMAT: "Định dạng email không hợp lệ!",
    WEAK_PASSWORD: "Mật khẩu phải có ít nhất 8 ký tự!",
    INVALID_CREDENTIALS: "Tài khoản hoặc mật khẩu không chính xác!",
    EMAIL_ALREADY_VERIFIED: "Email này đã được xác minh!",
    INVALID_VERIFICATION_CODE: "Mã xác minh không hợp lệ!",
    VERIFICATION_CODE_EXPIRED: "Mã xác minh đã hết hạn!",
    EMAIL_NOT_VERIFIED: "Email của bạn chưa được xác minh!",
    INVALID_PHONE_FORMAT: "Số điện thoại không hợp lệ!",
    TOKEN_EXPIRED: "Token đã hết hạn!",
    INVALID_TOKEN: "Token không hợp lệ!",

    // ---- SYSTEM ----
    INTERNAL_SERVER_ERROR: "Lỗi hệ thống, vui lòng thử lại sau!",
    ACCESS_DENIED: "Bạn không có quyền truy cập tài nguyên này!",

    // ---- USER ----
    USER_NOT_FOUND: "Không tìm thấy người dùng!",

    // ---- TAG ----
    TAG_NAME_ALREADY_EXISTS: "Tên nhãn đã tồn tại!",
    TAG_COLOR_ALREADY_EXISTS: "Màu sắc của nhãn đã tồn tại!",
    INVALID_TAG_COLOR: "Màu nhãn không hợp lệ (phải là HEX #RRGGBB hoặc #RRGGBBAA)!",
    TAG_NOT_FOUND: "Không tìm thấy nhãn!",
    TAG_NOT_ATTACHED_TO_LEARNING_PATH: "Nhãn chưa được gắn vào lộ trình học!",

    // ---- LEARNING PATH ----
    LEARNING_PATH_TITLE_ALREADY_EXISTS: "Tiêu đề lộ trình học đã tồn tại!",
    LEARNING_PATH_NOT_FOUND: "Không tìm thấy lộ trình học!",
    LEARNING_PATH_ALREADY_EXISTS: "Lộ trình đã tồn tại!",

    // ---- NOTE ----
    NOTE_TITLE_ALREADY_EXISTS: "Tiêu đề ghi chú đã tồn tại!",
    NOTE_NOT_FOUND: "Không tìm thấy ghi chú!",
    INVALID_NOTE_TARGET: "Mục tiêu ghi chú không hợp lệ!",

    // ---- TOPIC ----
    TOPIC_TITLE_ALREADY_EXISTS: "Tiêu đề chủ đề đã tồn tại!",
    TOPIC_NOT_FOUND: "Không tìm thấy chủ đề!",

    // ---- LESSON ----
    LESSON_TITLE_ALREADY_EXISTS: "Tiêu đề bài học đã tồn tại!",
    LESSON_NOT_FOUND: "Không tìm thấy bài học!",

    // ---- PROGRESS ----
    PROGRESS_NOT_FOUND: "Không tìm thấy tiến độ!",

    // ---- RESOURCES ----
    RESOURCE_NOT_FOUND: "Không tìm thấy tài nguyên!",

    // ---- FILE UPLOAD ----
    FILE_SIZE_TOO_LARGE: "Kích thước tập tin vượt quá giới hạn cho phép!",
    FILE_TYPE_NOT_ALLOWED: "Loại tập tin không được phép!",

    // ---- MINIO ----
    MINIO_UPLOAD_FAILED: "Tải tập tin lên MinIO thất bại!",
    MINIO_GET_FAILED: "Không lấy được tập tin từ MinIO!",
    MINIO_URL_GENERATE_FAILED: "Tạo URL truy cập tập tin thất bại!",
    MINIO_DELETE_FAILED: "Xóa tập tin khỏi MinIO thất bại!",

    // ---- POST ----
    POST_NOT_FOUND: "Không tìm thấy bài đăng!",
    ALREADY_LIKED_POST: "Bạn đã thích bài đăng này trước đó!",
    NOT_LIKED_YET: "Bạn chưa thích bài đăng này!",

    // ---- COMMENT ----
    COMMENT_NOT_FOUND: "Không tìm thấy bình luận!",

    // ---- DEFAULT ----
    DEFAULT: "Đã xảy ra lỗi, vui lòng thử lại sau!",
} as const;

export default ERROR_MESSAGES_VI;
