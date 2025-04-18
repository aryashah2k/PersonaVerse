export interface ResponseWrapper<T> {
    data: T | null;
    error: string | null;
}