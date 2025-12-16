import React, { useEffect, useState } from "react";
import { ResourceType } from "../../constants/resourceType";
import { mapResourceResponsesToResources, mapResourceResponseToResource, Resource } from "../../types/resource";
import "./ResourceContainer.css";
import { formatBytesToMB } from "../../utils/formatBytes";
import { getResourceIcon } from "../../utils/resourceUtils";
import Button from "../Button/Button";
import lessonService from "../../services/lessonService";
import ResourceModal from "../Modal/ResourceModalContent/ResourceModalContent";
import resourceService from "../../services/resourceService";
import toast from "react-hot-toast";
import ConfirmModal from "../Modal/ConfirmModal/ConfirmModal";
import DocumentPreviewModalContent from "../Modal/DocumentPreviewModalContent/DocumentPreviewModalContent";

interface ResourceProps {
    lessonId: string;
    isEdit: boolean;
    isUnlocked: boolean;
    onResourceView: (resource: Resource) => void;
    onResourceDelete: (resourceId: string) => void;
    onResourceAdd: () => void;
}

const ResourceContainer: React.FC<ResourceProps> = ({
    lessonId,
    isEdit,
    isUnlocked,
    onResourceView,
    onResourceDelete,
    onResourceAdd
}) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [resourceDeleteId, setResourceDeleteId] = useState('');
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [isShowDeleteResourceModal, setIsShowDeleteResourceModal] = useState(false);
    const [isShowPreviewResourceModal, setIsShowPreviewResourceModal] = useState(false);

    const [previewType, setPreviewType] = useState<
        | "image/jpeg"
        | "image/png"
        | "application/pdf"
        | "application/vnd.ms-powerpoint"
        | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        | "application/msword" // .doc
        | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        | "application/vnd.ms-excel" // .xls
        | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
    >("application/pdf");

    const [previewLink, setPreviewLink] = useState("");


    const handleUpLoadResource = async (data: { type: ResourceType; name: string; url?: string; file?: File }) => {
        if (!lessonId) return;

        try {
            if (data.type === ResourceType.LINK) {
                if (!data.url) return;

                const res = await resourceService.createLinkResource({
                    lessonId: lessonId, name: data.name, externalLink: data.url,
                });

                if (res.success && res.data) {
                    const data = mapResourceResponseToResource(res.data);
                    setResources(prev => {
                        if (!prev) return prev;

                        return [...prev, data];
                    });
                    toast.success("Upload link thành công!");
                }
            } else {
                if (!data.file) return;

                const res = await resourceService.createFileResource({
                    lessonId: lessonId, name: data.name, file: data.file,
                });

                if (res.success && res.data) {
                    const data = mapResourceResponseToResource(res.data);
                    setResources(prev => {
                        if (!prev) return prev;

                        return [...prev, data];
                    });
                    toast.success("Upload file thành công!");
                }
            }
        }
        catch {
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleDeleteResource = async () => {
        if (!resourceDeleteId) return;

        try {
            const res = await resourceService.deleteResourceById(resourceDeleteId);
            if (res.success) {
                toast.success("Xóa tài liệu thành công!");
                setIsShowDeleteResourceModal(false);
                setResources(prev => {
                    if (!prev) return prev;

                    return prev.filter(r => r.id !== resourceDeleteId);
                });
            }
        }
        catch {
            toast.error("Có lỗi xảy ra!");
        }
    }

    const handlePreviewResource = (type: string, link: string) => {
        if (!type || !link) return;

        let docType:
            | "image/jpeg"
            | "image/png"
            | "application/pdf"
            | "application/vnd.ms-powerpoint"
            | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            | "application/msword"
            | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            | "application/vnd.ms-excel"
            | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            = "application/pdf";

        type = type.toLowerCase();

        if (type.includes("png")) {
            docType = "image/png";
        } else if (type.includes("jpeg") || type.includes("jpg")) {
            docType = "image/jpeg";
        } else if (type.includes("pdf")) {
            docType = "application/pdf";
        } else if (type.includes("vnd.ms-powerpoint")) {
            docType = "application/vnd.ms-powerpoint"; // .ppt
        } else if (type.includes("presentation")) {
            docType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"; // .pptx
        } else if (type.includes("vnd.ms-word")) {
            docType = "application/msword"; // .doc
        } else if (type.includes("wordprocessingml.document")) {
            docType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // .docx
        } else if (type.includes("vnd.ms-excel")) {
            docType = "application/vnd.ms-excel"; // .xls
        } else if (type.includes("spreadsheetml.sheet")) {
            docType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // .xlsx
        }

        setPreviewType(docType);
        setPreviewLink(link);
        setIsShowPreviewResourceModal(true);
    }

    const downloadResource = async (resource: Resource) => {
        if (!resource.resourceUrl) return;

        try {
            const response = await fetch(resource.resourceUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = resource.name || "file";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    // Fecth all rssources by lesson id.
    useEffect(() => {
        if (!lessonId) return;

        const fetchResourcesByLessonId = async (lessonId: string) => {
            const response = await lessonService.getAllResourcesByLessonId(lessonId);
            if (response != null && response.data) {
                setResources(mapResourceResponsesToResources(response.data));
            }
        };

        fetchResourcesByLessonId(lessonId);
    }, [lessonId]);

    return (
        <div className="materials-section">
            <h4 className="materials-title">
                <i className="fas fa-file-alt"></i> Tài liệu học tập
            </h4>

            <div className="material-list">
                {resources.map(resource => {
                    const { icon, color } = getResourceIcon(resource);

                    return (
                        <div key={resource.id} className="material-item">
                            <div className="material-info">
                                <div className="material-icon" style={{ backgroundColor: color }}>
                                    <i className={icon}></i>
                                </div>
                                <div>
                                    <div className="material-name">{resource.name}</div>
                                    <div className="material-size">
                                        {resource.sizeBytes && formatBytesToMB(resource.sizeBytes)}
                                    </div>
                                </div>
                            </div>

                            <div className="material-actions">
                                {/* View */}
                                <i
                                    className="fas fa-eye view-material-btn"
                                    onClick={() => {
                                        if (resource.type === ResourceType.LINK && resource.externalLink) {
                                            window.open(resource.externalLink, "_blank");
                                        } else {
                                            handlePreviewResource(resource.mimeType || "application/pdf",
                                                resource.resourceUrl ?? '');
                                        }
                                    }}
                                ></i>

                                {/* Download (only file) */}
                                {resource.type !== ResourceType.LINK && resource.resourceUrl && (
                                    <i
                                        className="fas fa-download download-resource-btn"
                                        onClick={() => {
                                            downloadResource(resource);
                                        }}
                                    ></i>
                                )}

                                {/* Delete */}
                                {isEdit && isUnlocked && (
                                    <i
                                        className="fas fa-trash"
                                        onClick={() => {
                                            setResourceDeleteId(resource.id);
                                            setIsShowDeleteResourceModal(true);
                                        }}
                                    ></i>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* No materials (readonly view) */}
                {resources.length === 0 && !isEdit && (
                    <div className="empty-materials">
                        <i className="fa-solid fa-file"></i>
                        <p>Chưa có tài liệu nào</p>
                    </div>
                )}
            </div>

            {/* Add button */}
            {isEdit && isUnlocked && (
                <Button
                    fullWidth={false}
                    icon="fas fa-plus"
                    text="Thêm tài liệu"
                    backgroundColor="#3498db"
                    textColor="#fff"
                    onClick={() => { setIsResourceModalOpen(true) }}
                />
            )}

            <ResourceModal
                isOpen={isResourceModalOpen}
                onClose={() => setIsResourceModalOpen(false)}
                onSubmit={handleUpLoadResource}
            />

            <ConfirmModal
                isOpen={isShowDeleteResourceModal}
                title="Xác nhận xóa tài liệu"
                message="Bạn có chắc chắn muốn xóa tài liệu này không?"
                onCancel={() => setIsShowDeleteResourceModal(false)}
                onConfirm={handleDeleteResource}
            />

            <DocumentPreviewModalContent
                isOpen={isShowPreviewResourceModal}
                onClose={() => setIsShowPreviewResourceModal(false)}
                title="Xem trước tài liệu"
                type={previewType}
                link={previewLink}
            />
        </div>
    );
};

export default ResourceContainer;
