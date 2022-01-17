import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../interfaces/user-payload';

const createJwtFromUser = (user: UserPayload, jwtKey: string) => {
    if (!user) {
        return null;
    }
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        jwtKey
    );
};

export { createJwtFromUser };

export class JwtHandler {
    constructor(private jwtKey: string) {}

    addJwtToken(user: UserPayload, req: Request) {
        const userJwt = createJwtFromUser(user, this.jwtKey);
        req.session = { ...req.session, jwt: userJwt };
    }

    getValidJwtToken(req: Request): UserPayload | null {
        if (!req.session?.jwt) {
            console.log('No JWT present');
            return null;
        }

        try {
            return jwt.verify(req.session.jwt, this.jwtKey) as UserPayload;
        } catch (error) {
            console.log('Invalid JWT token:', error);
            return null;
        }
    }
}
