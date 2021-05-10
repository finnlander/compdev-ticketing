import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { createTicket, signin, testAppConfig } from '../../test/testHelpers';

const appConfig = testAppConfig();

it('returns an error if the ticket does not exist', async () => {
    const app = createApp(appConfig);

    const ticketId = mongoose.Types.ObjectId();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', signin(appConfig))
        .send({
            ticketId
        }).expect(400);

    expect(response.status).not.toEqual(404);
});


it('returns an error if the ticket is already reserved', async () => {
    const app = createApp(appConfig);

    const ticket = await createTicket();

    await Order.build({
        ticket,
        userId: 'asdf',
        status: OrderStatus.Created,
        expiresAt: new Date()
    }).save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', signin(appConfig))
        .send({
            ticketId: ticket.id
        }).expect(400);
});


it('reserves a ticket', async () => {
    const app = createApp(appConfig);

    const ticket = await createTicket();

    await request(app)
        .post('/api/orders')
        .set('Cookie', signin(appConfig))
        .send({
            ticketId: ticket.id
        }).expect(201);
});

it('emits an order created event', async () => {
    const app = createApp(appConfig);

    const ticket = await createTicket();

    await request(app)
        .post('/api/orders')
        .set('Cookie', signin(appConfig))
        .send({
            ticketId: ticket.id
        }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
