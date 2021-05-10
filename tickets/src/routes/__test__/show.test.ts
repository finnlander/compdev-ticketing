import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../../app';
import { signin, testAppConfig } from '../../test/testHelpers';

const appConfig = testAppConfig();


it('returns a 404 if the ticket is not found', async () => {
    const app = createApp(appConfig);
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`).send()
        .expect(404);
});

it('return the ticket if the ticket is found', async () => {
    const title = 'concert';
    const price = 20;

    const app = createApp(appConfig);
    const sessionCookie = signin(appConfig);

    const creationResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({
            title: title,
            price: price
        }).expect(201);

    console.log('Cretion response:', creationResponse.body);
    const ticketId = creationResponse.body.id;
    expect(ticketId).not.toBeNull();


    const ticketResponse = await request(app)
        .get(`/api/tickets/${ticketId}`).send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});

