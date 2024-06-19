export declare const exampleCreatedUser: {
    id: string;
    name: string;
    lastname: string;
    email: string;
    isActive: boolean;
    role: string;
    orders: any[];
};
export declare const userAlreadyExists: {
    status: number;
    description: string;
    schema: {
        example: {
            message: string;
            error: string;
            statusCode: number;
        };
    };
};
export declare const userValidationsErrors: {
    statusCode: number;
    message: string[];
    error: string;
}[];
