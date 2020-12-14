export default class ApiError extends Error {
    private statusCode: number;

    private code: string;

    constructor(code: string, statusCode = 400) {
        super(code);

        this.code = code;
        this.statusCode = statusCode;
    }
}
