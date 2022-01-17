import request from 'supertest';
import { OrderStatus } from 'udemy-ticketing-common';
import createApp from '../../app';
import Order from '../../models/order';
import natsWrapper from '../../nats-wrapper';
import { createTicket, signin, testAppConfig } from '../../test/testHelpers';

const appConfig = testAppConfig();

it('marks an order as cancelled', async () => {
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

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const storedOrder = await Order.findById(order.id);
    expect(storedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emits order cancelled event', async () => {
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

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
