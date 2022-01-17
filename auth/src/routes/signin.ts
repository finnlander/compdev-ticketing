import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    BadRequestError,
    JwtHandler,
    validateRequest,
} from 'udemy-ticketing-common';
import { User } from '../models/user';
import Password from '../services/password';

const router = express.Router();

const MSG_INVALID_CREDS = 'Invalid credentials';

const emailValidator = body('email')
    .isEmail()
    .withMessage('Email must be valid');

const passwordValidator = body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must be supplied');

const jwtHandler = new JwtHandler(process.env.JWT_KEY!);

router.post(
    '/api/users/signin',
    [emailValidator, passwordValidator],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError(MSG_INVALID_CREDS);
        }

        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );
        if (!passwordsMatch) {
            throw new BadRequestError(MSG_INVALID_CREDS);
        }

        jwtHandler.addJwtToken(existingUser, req);
        res.status(200).send(existingUser);
    }
);

export default router;
