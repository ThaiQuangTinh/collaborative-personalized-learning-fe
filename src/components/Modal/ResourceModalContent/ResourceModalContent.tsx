import React, { useRef, useState } from "react";
import { ResourceType } from "../../../constants/resourceType";
import ButtonCancel from "../../ButtonCancel/ButtonCancel";
import ButtonSave from "../../ButtonSave/ButtonSave";
import FormLabel from "../../FormLabel/FormLabel";
import Input from "../../Input/Input";
import AppModal from "../AppModal/AppModal";
import "./ResourceModalContent.css";

interface ResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { type: ResourceType; name: string; url?: string; file?: File }) => void;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [mode, setMode] = useState<ResourceType>(ResourceType.LINK);
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // --- error states ---
    const [nameError, setNameError] = useState<string>("");
    const [linkError, setLinkError] = useState<string>("");
    const [fileError, setFileError] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setName("");
        setLink("");
        setFile(null);
        setNameError("");
        setLinkError("");
        setFileError(""); // reset luôn lỗi file
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // --- Validation ---
    const validateName = () => {
        if (!name.trim()) {
            setNameError("Tên tài liệu không được để trống");
            return false;
        }
        setNameError("");
        return true;
    };

    const validateLink = () => {
        if (mode !== ResourceType.LINK) return true;

        if (!link.trim()) {
            setLinkError("URL không được để trống");
            return false;
        }

        const urlRegex = /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/;
        if (!urlRegex.test(link)) {
            setLinkError("URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://)");
            return false;
        }

        setLinkError("");
        return true;
    };

    const validateFile = () => {
        if (mode !== ResourceType.FILE) return true;

        if (!file) {
            setFileError("Bạn chưa chọn file");
            return false;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setFileError("Kích thước file tối đa là 10MB");
            return false;
        }

        const allowedTypes = [
            "application/pdf",

            // images
            "image/png",
            "image/jpeg",
            "image/jpg",

            // PowerPoint
            "application/vnd.ms-powerpoint", // .ppt
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

            // Word
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx

            // Excel
            "application/vnd.ms-excel", // .xls
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        ];

        if (!allowedTypes.includes(file.type)) {
            setFileError("File không hợp lệ. Chỉ hỗ trợ PDF, PNG, JPG.");
            return false;
        }

        setFileError("");
        return true;
    };

    const handleSubmit = () => {
        const validName = validateName();
        const validUrl = validateLink();
        const validFile = validateFile();

        if (!validName || !validUrl || !validFile) return;

        if (mode === ResourceType.LINK) {
            onSubmit({ type: ResourceType.LINK, name, url: link });
        } else {
            onSubmit({ type: ResourceType.FILE, name, file: file! });
        }

        resetForm();
        onClose();
    };

    // Khi chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setFile(f);

        if (f) {
            setFileError(""); // clear lỗi khi chọn file mới
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    return (
        <AppModal isOpen={isOpen} onClose={handleClose} title="Thêm tài liệu mới">
            <div className="material-modal">

                {/* Tabs */}
                <div className="material-modal__tabs">
                    <button
                        className={`material-modal__tab ${mode === ResourceType.LINK ? "material-modal__tab--active" : ""}`}
                        onClick={() => {
                            setMode(ResourceType.LINK);
                            setFileError("");
                            setLinkError("");
                        }}
                    >
                        <i className="fa-solid fa-link"></i> Thêm Link
                    </button>

                    <button
                        className={`material-modal__tab ${mode === ResourceType.FILE ? "material-modal__tab--active" : ""}`}
                        onClick={() => {
                            setMode(ResourceType.FILE);
                            setLinkError("");
                        }}
                    >
                        <i className="fa-solid fa-upload"></i> Upload File
                    </button>
                </div>

                {/* Form */}
                <div className="material-modal__content">
                    <div className="material-modal__field">
                        <FormLabel text="Tên tài liệu" required />
                        <Input
                            value={name}
                            placeholder="Nhập tên tài liệu..."
                            onChange={(e) => setName(e.target.value)}
                            onBlur={validateName}
                            error={nameError}
                            focusColor="#4361ee"
                        />
                    </div>

                    {mode === ResourceType.LINK && (
                        <div className="material-modal__field">
                            <FormLabel text="Đường dẫn URL" required />
                            <Input
                                value={link}
                                placeholder="https://..."
                                onChange={(e) => setLink(e.target.value)}
                                onBlur={validateLink}
                                error={linkError}
                                focusColor="#4361ee"
                            />
                        </div>
                    )}

                    {mode === ResourceType.FILE && (
                        <div className="material-modal__field">
                            <FormLabel text="Chọn file" required />

                            <div className="material-modal__file-upload">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="material-modal__file-input"
                                />

                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="material-modal__upload-btn"
                                >
                                    <i className="fa-regular fa-file"></i> Chọn file
                                </button>
                            </div>

                            {file && (
                                <div className="material-modal__file-info">
                                    <span className="material-modal__file-name">{file.name}</span>
                                    <span className="material-modal__file-size">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                            )}

                            {fileError && (
                                <p style={{ color: "#e63946", marginTop: "6px", fontSize: "13px" }}>
                                    {fileError}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="material-modal__actions">
                    <ButtonCancel onClick={handleClose} />

                    <ButtonSave
                        text='Tạo'
                        icon='fa-solid fa-plus'
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </AppModal>
    );
};

export default ResourceModal;