export default interface Profile {
    id: string;
    name: string;
    username: string;
    profileImage: string | null;
    tokens: number;
    planType: string;
    createdAt: string;
}

export function copyWith(data: any): Profile {
    return {
        id: data.id,
        name: data.name,
        username: data.username,
        profileImage: data.profile_image || null,
        tokens: data.tokens,
        planType: data.plan_type,
        createdAt: data.created_at,
    };
}