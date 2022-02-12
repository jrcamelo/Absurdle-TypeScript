export default class ApiError extends Error {
    statusCode: number;

    constructor(message: string, code = 401) {
        super(message);
        this.statusCode = code;
    }

    toJson(): object {
        return {
            statusCode: this.statusCode,
            body: {
                error: this.message,
            },
        };
    }
}
