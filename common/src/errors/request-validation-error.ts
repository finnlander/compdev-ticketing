import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    constructor(public errors: ValidationError[]) {
        super(400, 'Request validation failed');
        // extending built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    // implements abstract method from the base class
    // eslint-disable-next-line class-methods-use-this
    serializeErrors() {
        const errors = this.errors.map((error) => ({
            message: error.msg,
            field: error.param,
        }));
        return errors;
    }
}
