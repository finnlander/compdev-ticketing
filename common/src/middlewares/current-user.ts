import { NextFunction, Request, Response } from 'express'
import { Session } from '../interfaces/session'
import { UserPayload } from '../interfaces/user-payload'
import { JwtHandler } from '../services/jwt-handler'



declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
            session: Session
        }
    }
}


const currentUserMiddlewareCreator = (jwtKey: string) => {
    const jwtHandler = new JwtHandler(jwtKey)
    return (req: Request<{}, {}, UserPayload>, res: Response, next: NextFunction) => {

        if (!req.session?.jwt) {
            return next()
        }

        const payload = jwtHandler.getValidJwtToken(req)
        if (payload) {
            req.currentUser = payload
        }

        next()
    }
}

export { currentUserMiddlewareCreator }
