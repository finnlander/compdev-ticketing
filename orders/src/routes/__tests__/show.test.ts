import request from 'supertest';
import createApp from '../../app';
import { createTicket, signin, testAppConfig } from '../../test/testHelpers';

const appConfig = testAppConfig();

it('fetches the order', async () => {
    const app = createApp(appConfig);

    const ticket = await createTicket();
    const user = signin(appConfig);

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if user tries to fetch other users order ', async () => {
    const app = createApp(appConfig);

    const ticket = await createTicket();
    const user = signin(appConfig);
    const other = signin(appConfig);

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', other)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(401);
});
