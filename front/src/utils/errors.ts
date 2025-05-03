export class AppError extends Error {
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(message: string, statusCode = 400, details?: any) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.details = details;
    }
}


export function handleApiError(error: any): AppError {
    if (error.response) {
        const statusCode = error.response.status;
        const message = error.response.data?.message || "Erro inesperado.";
        return new AppError(message, statusCode);
    } else if (error.request) {
        return new AppError("Erro de conexão. Verifique sua internet.", 0);
    } else {
        return new AppError(error.message || "Erro desconhecido.", 0);
    }
}