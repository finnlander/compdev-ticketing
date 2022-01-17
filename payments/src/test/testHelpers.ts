import mongoose from 'mongoose';
import {
    createJwtFromUser,
    OrderStatus,
    UserPayload,
} from 'udemy-ticketing-common';
import { AppConfiguration, AppEnv } from '../interfaces/app-configuration';
import Order from '../models/order';

const createRandomId = () => mongoose.Types.ObjectId().toHexString();

const signin = (config: AppConfiguration, id?: string) => {
    const sessionKey = 'session';
    const { jwtKey } = config;

    // build a JWT payload. {id, email}
    const payload: UserPayload = {
        id: id || createRandomId(),
        email: 'test@test.com',
    };

    // Create the JWT
    const jwt = createJwtFromUser(payload, jwtKey);
    // Build session object {jwt: MY_JWT}
    const session = { jwt };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Encode JSON as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return `${sessionKey}=${base64}`;
};

const testAppConfig: () => AppConfiguration = () => ({
    env: AppEnv.test,
    jwtKey: 'secret',
    mongoURI: '',
});

const createMockMessage = () => {
    // create only relevant functions for the mock message
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return msg;
};

const createOrder = async () => {
    const order = await Order.build({
        id: createRandomId(),
        status: OrderStatus.Created,
        userId: createRandomId(),
        price: 10,
        version: 0,
    }).save();

    return order;
};

export {
    signin,
    testAppConfig,
    createMockMessage,
    createRandomId,
    createOrder,
};
