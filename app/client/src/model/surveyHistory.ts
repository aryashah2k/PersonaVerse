export default interface SurveyHistory {
    id: string;
    createdAt: string;
    fileUrl: string;
    fileName: string;
    tokensUsed: number;
    modelUsed: string;
}

export function copyWith(data: any): SurveyHistory {
    return {
        id: data.id,
        createdAt: data.created_at,
        fileUrl: data.file_url,
        fileName: data.file_name,
        tokensUsed: data.tokens_used,
        modelUsed: data.model_used
    };
}