export default interface Profile {
    id: string;
    name: string;
    username: string;
    profile_image: string | null;
    tokens: number;
    plan_type: string;
    created_at: string;
}

export function copyWith(data: any): Profile {
    return {
        id: data.id,
        name: data.name,
        username: data.username,
        profile_image: data.profile_image || null,
        tokens: data.tokens,
        plan_type: data.plan_type,
        created_at: data.created_at,
    };
}