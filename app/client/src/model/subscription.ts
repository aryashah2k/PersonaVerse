export default interface Subscription {
    id: string;
    tokens: number;
    monthlyPrice: number;
    currencySymbol: string;
    features: string[];
    uploads: number | null;
}

export function copyWith(data: any): Subscription {
    return {
        id: data.id,
        tokens: data.tokens as number,
        monthlyPrice: data.monthly_price as number,
        currencySymbol: data.currency_symbol,
        features: Array.isArray(data.features) ? data.features : JSON.parse(data.features),
        uploads: data.uploads_allowed
    };
}