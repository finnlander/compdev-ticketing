import cookieSession from 'cookie-session'
import express, { RequestHandler } from 'express'
import 'express-async-errors'
import { currentUserMiddlewareCreator, errorHandler, NotFoundError } from 'udemy-ticketing-common'
import { AppConfiguration, AppEnv } from './interfaces/app-configuration'
import { indexTicketRouter } from './routes/index'
import { createTicketRouter } from './routes/new'
import { showTickerRouter } from './routes/show'
import { updateTicketRouter } from './routes/update'





function createApp(config: AppConfiguration) {
    const currentUserMiddleware = currentUserMiddlewareCreator(config.jwtKey)
    const useSecureCookies = config.env !== AppEnv.test

    return express()
        .set('trust proxy', true)
        .use(express.json() as RequestHandler)
        .use(cookieSession({
            signed: false,
            secure: useSecureCookies
        }))
        .use(currentUserMiddleware)
        .use(createTicketRouter)
        .use(showTickerRouter)
        .use(indexTicketRouter)
        .use(updateTicketRouter)
        // default route
        .all('*', (req, res, next) => { next(new NotFoundError()) })
        .use(errorHandler)
}

export { createApp }
