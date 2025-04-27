export default interface SurveyResponse {
    filePath: string;
    fileName: string;
    tokensUsed: number;
    modelUsed: number;
}

export function copyWith(data: any): SurveyResponse {
    return {
        filePath: data.bucket_storage_path,
        fileName: data.file_name,
        tokensUsed: data.tokens_used,
        modelUsed: data.model_used
    };
}