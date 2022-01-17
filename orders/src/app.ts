import cookieSession from 'cookie-session';
import express, { RequestHandler } from 'express';
import 'express-async-errors';
import {
    currentUserMiddlewareCreator,
    errorHandler,
    NotFoundError,
} from 'udemy-ticketing-common';
import { AppConfiguration, AppEnv } from './interfaces/app-configuration';
import deleteOrderRouter from './routes/delete';
import indexOrderRouter from './routes/index';
import createOrderRouter from './routes/new';
import showOrderRouter from './routes/show';

function createApp(config: AppConfiguration) {
    const currentUserMiddleware = currentUserMiddlewareCreator(config.jwtKey);
    const useSecureCookies = config.env !== AppEnv.test;

    return (
        express()
            .set('trust proxy', true)
            .use(express.json() as RequestHandler)
            .use(
                cookieSession({
                    signed: false,
                    secure: useSecureCookies,
                })
            )
            .use(currentUserMiddleware)
            .use(indexOrderRouter)
            .use(deleteOrderRouter)
            .use(createOrderRouter)
            .use(showOrderRouter)
            // default route
            .all('*', (req, res, next) => {
                next(new NotFoundError());
            })
            .use(errorHandler)
    );
}

export default createApp;
