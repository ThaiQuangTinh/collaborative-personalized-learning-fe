import React, { useState } from "react";
import WebViewerPreview from "../../WebViewerPreview/WebViewerPreview";
import AppModal from "../AppModal/AppModal";
import "./DocumentPreviewModalContent.css";
import ImagePreview from "../../ImagePreview/ImagePreview";

export type DocumentType =
    | "image/jpeg"
    | "image/png"
    | "application/pdf"
    | "application/vnd.ms-powerpoint"
    | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    | "application/msword" // .doc
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
    | "application/vnd.ms-excel" // .xls
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx

export interface DocumentPreviewModalContentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    type: DocumentType;
    link: string;
}

const DocumentPreviewModalContent: React.FC<DocumentPreviewModalContentProps> = ({
    isOpen,
    onClose,
    title = "Xem tài liệu",
    type,
    link
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleLoad = () => {
        setIsLoading(false);
        setError(null);
    };

    const handleError = () => {
        setIsLoading(false);
        setError("Không thể tải tài liệu");
    };

    const renderPreview = () => {
        if (type.startsWith("image/")) {
            return (
                <ImagePreview link={link} />
            );
        }

        if (
            type === 'application/pdf' ||
            type === 'application/vnd.ms-powerpoint' ||
            type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            type === 'application/msword' ||
            type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            type === 'application/vnd.ms-excel' ||
            type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            return (
                <div style={{ height: '80vh' }}>
                    <WebViewerPreview file={link} />
                </div>
            );
        }

        return <div className="dpv__unsupported">Định dạng tài liệu không được hỗ trợ</div>;
    };

    return (
        <AppModal isOpen={isOpen} onClose={onClose} title={title} padding="20px 20px">
            <div className="dpv">
                {error ? (
                    <div className="dpv__error">
                        <div className="dpv__error-icon">⚠️</div>
                        <div className="dpv__error-message">{error}</div>
                    </div>
                ) : (
                    renderPreview()
                )}
            </div>
        </AppModal>
    );
};

export default DocumentPreviewModalContent;