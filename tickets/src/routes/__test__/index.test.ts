import { Express } from 'express';
import request from 'supertest';
import createApp from '../../app';
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

it('can fetch a list of tickets', async () => {
    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);

    await createTicket(app, sessionCookie);
    await createTicket(app, sessionCookie);
    await createTicket(app, sessionCookie);

    const response = await request(app).get('/api/tickets/').send().expect(200);

    expect(response.body.length).toEqual(3);
});
