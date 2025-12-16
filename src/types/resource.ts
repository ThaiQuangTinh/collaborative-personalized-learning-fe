import { ResourceType } from "../constants/resourceType";

export interface Resource {
    id: string,
    name: string,
    type: ResourceType,
    externalLink?: string,
    sizeBytes?: number,
    mimeType?: string,
    resourceUrl?: string
}

export interface ResourceRespnse {
    resourceId: string,
    name: string,
    type: ResourceType,
    externalLink?: string,
    sizeBytes?: number,
    mimeType?: string,
    resourceUrl?: string
}

// Map 1 ResourceRespnse -> Resource
export const mapResourceResponseToResource = (res: ResourceRespnse): Resource => ({
    id: res.resourceId,       // map khác tên
    name: res.name,
    type: res.type,
    externalLink: res.externalLink,
    sizeBytes: res.sizeBytes,
    mimeType: res.mimeType,
    resourceUrl: res.resourceUrl
});

// Map nhiều ResourceRespnse -> Resource[]
export const mapResourceResponsesToResources = (responses: ResourceRespnse[]): Resource[] =>
    responses.map(mapResourceResponseToResource);

export interface ImportResourceRequest {
    name: string,
    type: ResourceType,
    objectName: string,
    externalLink: string,
    sizeBytes: number,
    mimeType: string,
    originalResourceId: string,
}

export interface ExportResourceResponse {
    name: string,
    type: ResourceType,
    objectName: string,
    externalLink: string,
    sizeBytes: number,
    mimeType: string,
    originalResourceId: string,
}

export interface CreateLinkResourceRequest {
    lessonId: string,
    name: string,
    externalLink: string
}

export interface CreateLinkResourceResponse {
    resourceId: string,
    name: string,
    type: ResourceType,
    externalLink: string,
    createdAt: string
}

export interface CreateFileResourceRequest {
    lessonId: string,
    name: string,
    file: File
}

export interface CreateFileResourceResponse {
    resourceId: string,
    name: string,
    type: ResourceType,
    sizeBytes: number
    mimeType: string,
    createdAt: string
}

export interface ResourceUrlResponse {
    resourceUrl: string;
}