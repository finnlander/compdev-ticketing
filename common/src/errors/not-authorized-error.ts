import { CustomError } from './custom-error';

const ERROR_MESSAGE = 'Not authorized';
export class NotAuthorizedError extends CustomError {
    constructor() {
        super(401, ERROR_MESSAGE);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    // implements abstract method from the base class
    // eslint-disable-next-line class-methods-use-this
    serializeErrors() {
        return [{ message: ERROR_MESSAGE }];
    }
}
