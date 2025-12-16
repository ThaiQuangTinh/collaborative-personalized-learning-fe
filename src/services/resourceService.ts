import { ApiResponse } from "../types/common";
import { CreateFileResourceRequest, CreateFileResourceResponse, CreateLinkResourceRequest, CreateLinkResourceResponse, ResourceRespnse, ResourceUrlResponse } from "../types/resource";
import api from "./api";

const RESOURCE_BASE = "/api/resources";

class ResourceService {

    // Create link resource.
    async createLinkResource(data: CreateLinkResourceRequest):
        Promise<ApiResponse<ResourceRespnse>> {

        return api.post(`${RESOURCE_BASE}/upload/link`, data);
    }

    // Create file resource.
    async createFileResource(data: CreateFileResourceRequest):
        Promise<ApiResponse<ResourceRespnse>> {

        const formData = new FormData()
        formData.set("file", data.file);
        formData.set("lessonId", data.lessonId);
        formData.set("name", data.name);

        return api.post(`${RESOURCE_BASE}/upload/file`, formData);
    }

    // Get resource url by resource id.
    async getUrlResourceById(resourceId: string):
        Promise<ApiResponse<ResourceUrlResponse>> {

        return api.get(`${RESOURCE_BASE}/${resourceId}/url`);
    }

    // Download resource by id.
    async downloadResourceById(resourceId: string) {
        const response = await api.get(`${RESOURCE_BASE}/${resourceId}/download`, {
            responseType: "blob"
        });

        const contentDisposition = response.headers["content-disposition"];
        const fileNameMatch = /filename="(.+)"/.exec(contentDisposition);
        const fileName = fileNameMatch?.[1] || "download";

        return {
            file: response.data,
            fileName: fileName,
        };
    }
    
    // Delete resource by id.
    async deleteResourceById(resourceId: string):
        Promise<ApiResponse<null>> {

        return api.delete(`${RESOURCE_BASE}/${resourceId}`);
    }

}

const resourceService = new ResourceService();

export default resourceService;