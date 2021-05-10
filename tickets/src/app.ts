import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUserMiddlewareCreator } from 'udemy-ticketing-common'

import { createTicketRouter } from './routes/new';
import { showTickerRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

import { AppConfiguration, AppEnv } from './interfaces/app-configuration';



function createApp(config: AppConfiguration) {
    const currentUserMiddleware = currentUserMiddlewareCreator(config.jwtKey);
    const useSecureCookies = config.env !== AppEnv.test;

    return express()
        .set('trust proxy', true)
        .use(express.json())
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
        .all('*', (req, res, next) => { next(new NotFoundError()); })
        .use(errorHandler);
}

export { createApp };