import { ResourceType } from "../constants/resourceType";
import { Resource } from "../types/resource";

export const getResourceIcon = (resource: Resource) => {
    if (resource.type === ResourceType.FILE) {
        switch (resource.mimeType) {
            // PDF
            case "application/pdf":
                return { icon: "fas fa-file-pdf", color: "#e74c3c" };

            // PowerPoint
            case "application/vnd.ms-powerpoint":
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                return { icon: "fas fa-file-powerpoint", color: "#d35400" };

            // Word
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return { icon: "fas fa-file-word", color: "#2980b9" };

            // Excel
            case "application/vnd.ms-excel":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return { icon: "fas fa-file-excel", color: "#27ae60" };

            // Ảnh JPG/JPEG
            case "image/jpeg":
            case "image/jpg":
                return { icon: "fas fa-file-image", color: "#16a085" };

            // Ảnh PNG
            case "image/png":
                return { icon: "fas fa-file-image", color: "#1abc9c" };

            default:
                return { icon: "fas fa-file", color: "#7f8c8d" };
        }
    } else {
        return { icon: "fas fa-link", color: "#8e44ad" };
    }
};
