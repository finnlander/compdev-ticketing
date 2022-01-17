import { CustomError } from './custom-error';

const ERROR_MESSAGE = 'Error connecting to database';

export class DatabaseConnectionError extends CustomError {
    reason = ERROR_MESSAGE;

    constructor() {
        super(500, ERROR_MESSAGE);
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}
