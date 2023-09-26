export interface EmojiRequest {
    id: string;
    name: string;
    url: string;
    createdYear: number;
    createdMonth: number;
    status: 'pending' | 'approved' | 'rejected';
    staffComment: string;
    comment: string;
    userId: string;
    username: string;
    processerId: string;
    processedAt: string;
    processerName: string | null;
}
