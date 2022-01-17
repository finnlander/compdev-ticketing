import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
    createJwtFromUser,
    OrderStatus,
    UserPayload,
} from 'udemy-ticketing-common';
import { AppConfiguration, AppEnv } from '../interfaces/app-configuration';
import Order from '../models/order';
import Ticket from '../models/ticket';
import { TicketDoc } from '../models/ticket-doc';

const signin: (config: AppConfiguration) => string = (
    config: AppConfiguration
) => {
    const sessionKey = 'express:sess';
    const { jwtKey } = config;

    // build a JWT payload. {id, email}
    const payload: UserPayload = {
        id: new mongoose.Types.ObjectId().toHexString(),
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

const createTicket = async () => {
    const ticket = await Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    }).save();

    return ticket;
};

const createOrder = async (ticket: TicketDoc) => {
    const order = await Order.build({
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        ticket,
    }).save();

    return order;
};

const createMockMessage = () => {
    // create only relevant functions for the mock message
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return msg;
};

export { signin, testAppConfig, createTicket, createOrder, createMockMessage };
