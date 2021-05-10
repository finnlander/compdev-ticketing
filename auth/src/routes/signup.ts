import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest, BadRequestError, JwtHandler } from 'udemy-ticketing-common';

const router = express.Router();

const jwtHandler = new JwtHandler(process.env.JWT_KEY!);

const emailValidator = body('email')
    .isEmail()
    .withMessage('Email must be valid');

const passwordValidator = body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters');

router.post(
    '/api/users/signup',
    [
        emailValidator,
        passwordValidator
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError(`Email "${email}" is already in use `);
        }

        const user = User.build({ email, password });
        await user.save();

        jwtHandler.addJwtToken(user, req);
        res.status(201).send(user);
    });

export { router as signupRouter };