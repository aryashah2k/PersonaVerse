export interface AIModel {
    id: string;
    name: string;
    description?: string;
    usageType: string[];
}

export function copyWith(data: any): AIModel {
    return {
        id: data.id,
        name: data.name as string,
        description: data.description ? data.description as string : '',
        usageType: Array.isArray(data.usage_type) ? data.usage_type : JSON.parse(data.usage_type)
    };
}