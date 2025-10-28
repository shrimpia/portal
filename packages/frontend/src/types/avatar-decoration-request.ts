export interface AvatarDecorationRequest {
    id: string;
    name: string;
    description: string;
    url: string;
    createdYear: number;
    createdMonth: number;
    status: 'pending' | 'approved' | 'rejected';
    staffComment: string;
    userId: string;
    username: string;
    createdAt: number;
    processerId?: string;
    processedAt?: number;
    processerName?: string | null;
}