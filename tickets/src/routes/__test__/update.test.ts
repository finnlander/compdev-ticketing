import { Express } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import createApp from '../../app';
import Ticket from '../../models/ticket';
import natsWrapper from '../../nats-wrapper';
import { signin, testAppConfig } from '../../test/testHelpers';

const appConfig = testAppConfig();

const createTicket = (app: Express, sessionCookie: string) => {
    const title = 'concert';
    const price = 20;

    return request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({
            title,
            price,
        })
        .expect(201);
};

it('returns a 404 if the provided id does not exist', async () => {
    const title = 'concert';
    const price = 20;

    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', sessionCookie)
        .send({
            title,
            price,
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const title = 'concert';
    const price = 20;

    const app = createApp(appConfig);
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title,
            price,
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const app = createApp(appConfig);

    const newTitle = 'another concert';
    const newPrice = 30;

    const createTicketResp = await createTicket(app, signin(appConfig));
    const sessionCookie = signin(appConfig);

    const existingTicketId = createTicketResp.body.id;
    expect(existingTicketId).not.toBeNull();

    await request(app)
        .put(`/api/tickets/${createTicketResp.body.id}`)
        .set('Cookie', sessionCookie)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const app = createApp(appConfig);
    // note: invalid input
    const newTitle = '';
    const newPrice = 30;
    const sessionCookie = signin(appConfig);
    const createTicketResp = await createTicket(app, sessionCookie);

    const existingTicketId = createTicketResp.body.id;
    expect(existingTicketId).not.toBeNull();

    await request(app)
        .put(`/api/tickets/${createTicketResp.body.id}`)
        .set('Cookie', sessionCookie)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${createTicketResp.body.id}`)
        .set('Cookie', sessionCookie)
        .send({
            title: 'valid title',
            price: -30,
        })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const app = createApp(appConfig);

    const newTitle = 'new title';
    const newPrice = 30;
    const sessionCookie = signin(appConfig);
    const createTicketResp = await createTicket(app, sessionCookie);

    const existingTicketId = createTicketResp.body.id;
    expect(existingTicketId).not.toBeNull();

    await request(app)
        .put(`/api/tickets/${createTicketResp.body.id}`)
        .set('Cookie', sessionCookie)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(200);

    const { body } = await request(app)
        .get(`/api/tickets/${createTicketResp.body.id}`)
        .set('Cookie', sessionCookie)
        .send()
        .expect(200);

    expect(body.title).toEqual(newTitle);
    expect(body.price).toEqual(newPrice);
});

it('publishes an event', async () => {
    const app = createApp(appConfig);

    const newTitle = 'new title';
    const newPrice = 30;
    const sessionCookie = signin(appConfig);
    const createTicketResp = await createTicket(app, sessionCookie);

    const existingTicketId = createTicketResp.body.id;
    expect(existingTicketId).not.toBeNull();

    await request(app)
        .put(`/api/tickets/${createTicketResp.body.id}`)
        .set('Cookie', sessionCookie)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(200);

    await request(app)
        .get(`/api/tickets/${createTicketResp.body.id}`)
        .set('Cookie', sessionCookie)
        .send()
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);
    const createTicketResp = await createTicket(app, sessionCookie);

    const ticketId = createTicketResp.body.id;

    const ticket = await Ticket.findById(ticketId);
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', sessionCookie)
        .send()
        .expect(400);
});
