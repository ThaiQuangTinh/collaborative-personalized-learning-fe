export interface Tag {
    id: string,
    tagName: string,
    textColor?: string
}

export interface TagResponse {
    tagId: string,
    tagName: string,
    textColor?: string
}

export const mapTagResponseToTag = (res: TagResponse): Tag => ({
    id: res.tagId,
    tagName: res.tagName,
    textColor: res.textColor ?? '#000000',
});

export const mapTagResponsesToTags = (resList: TagResponse[]): Tag[] =>
    resList.map(r => mapTagResponseToTag(r));

export interface UpdateTagRequest {
    tagName: string,
    textColor: string
}

export interface UpdateTagResponse {
    tagId: string,
    tagName: string,
    textColor: string
}

export interface CreateTagRequest {
    tagName: string,
    textColor: string
}

export interface CreateTagResponse {
    tagId: string,
    tagName: string,
    textColor: string
}