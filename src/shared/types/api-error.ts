export class ApiError extends Error {
    public readonly errorType: string;
    public readonly status?: number;

    constructor(message: string, errorType: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.errorType = errorType;
        this.status = status;
    }
}
