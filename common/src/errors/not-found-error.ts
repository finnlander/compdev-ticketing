import { CustomError } from "./custom-error";


const ERROR_MESSAGE = 'Resource not found';
export class NotFoundError extends CustomError {

    constructor() {
        super(404, ERROR_MESSAGE);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: ERROR_MESSAGE }]
    }
}