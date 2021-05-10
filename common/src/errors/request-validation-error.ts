import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {

    constructor(public errors: ValidationError[]) {
        super(400, 'Request validation failed');
        // extending built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        const errors = this.errors.map(error => {
            return {
                message: error.msg,
                field: error.param
            }
        });
        return errors;
    }
}
