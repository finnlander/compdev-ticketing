import cookieSession from 'cookie-session'
import express, { RequestHandler } from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError } from 'udemy-ticketing-common'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'



const useSecureCookies = process.env.NODE_ENV !== 'test'
export const app = express()
    .set('trust proxy', true)
    .use(express.json() as RequestHandler)
    .use(cookieSession({
        signed: false,
        secure: useSecureCookies

    }))
    .use(currentUserRouter)
    .use(signinRouter)
    .use(signoutRouter)
    .use(signupRouter)
    // default route
    .all('*', (req, res, next) => { next(new NotFoundError()) })
    .use(errorHandler)
