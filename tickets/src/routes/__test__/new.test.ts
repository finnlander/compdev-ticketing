import request from 'supertest';
import createApp from '../../app';
import Ticket from '../../models/ticket';
import natsWrapper from '../../nats-wrapper';
import { signin, testAppConfig } from '../../test/testHelpers';

const appConfig = testAppConfig();

it('has a route handler to post tickets in /api/tickets', async () => {
    const app = createApp(appConfig);
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
});

it('cannot be accessed if the user is NOT signed in', async () => {
    const app = createApp(appConfig);
    return request(app).post('/api/tickets').send({}).expect(401);
});

it('can be accessed if the user IS signed in', async () => {
    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns a error if an invalid title is provided', async () => {
    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({
            title: '',
            price: 10,
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({
            price: 10,
        })
        .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({
            title: 'title',
            price: -10,
        })
        .expect(400);

    return request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({
            title: 'title',
        })
        .expect(400);
});

it('creates a ticket with valid inputs', async () => {
    const expectedPrice = 20;
    const expectedTitle = 'title';

    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({
            title: expectedTitle,
            price: expectedPrice,
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(expectedPrice);
    expect(tickets[0].title).toEqual(expectedTitle);
});

it('publishes an event', async () => {
    const expectedPrice = 20;
    const expectedTitle = 'title';

    const tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({
            title: expectedTitle,
            price: expectedPrice,
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
