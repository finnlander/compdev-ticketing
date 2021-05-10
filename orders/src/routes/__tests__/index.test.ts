import request from 'supertest';
import { createApp } from '../../app';
import { createTicket, signin, testAppConfig } from '../../test/testHelpers';


const appConfig = testAppConfig();

it('fetches orders for an particular user', async () => {
    const app = createApp(appConfig);

    const ticket1 = await createTicket();
    const ticket2 = await createTicket();
    const ticket3 = await createTicket();

    const user1 = signin(appConfig);
    const user2 = signin(appConfig);

    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);

    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);

    const { body: order2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});