export interface Persona {
    id: string;
    name: string;
    age: number;
    gender: string;
    job: string;
    location: string;
    // background: string;
    description: string;
    imageURL?: string;
}

export function copyWith(data: any): Persona {
    return {
        id: data.id,
        name: data.name as string,
        age: data.age as number,
        gender: data.gender as string,
        job: data.job as string,
        description: data.description as string,
        location: data.location as string,
        imageURL: data.image_url as string,
    };
}