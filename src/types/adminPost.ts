export interface AdminPostResponse {
    postId: string,
    title: string,
    content: string,
    authorName: string,
    likeCount: number,
    commentCount: number,
    createdAt: string
}