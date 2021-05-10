import request from 'supertest';
import { createApp } from '../../app';
import { OrderStatus } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';
import { createOrder, createRandomId, signin, testAppConfig } from '../../test/testHelpers';

const appConfig = testAppConfig();
jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
    const app = createApp(appConfig);
    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(appConfig))
        .send({
            token: 'asdf',
            orderId: createRandomId()
        })
        .expect(404);
});


it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const app = createApp(appConfig);
    const order = await createOrder();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(appConfig))
        .send({
            token: 'asdf',
            orderId: order.id
        })
        .expect(401);

});


it('returns a 400 when purchaising a cancelled order', async () => {
    const app = createApp(appConfig);

    const order = await createOrder();
    await order.set({ status: OrderStatus.Cancelled }).save();


    await await request(app)
        .post('/api/payments')
        .set('Cookie', signin(appConfig, order.userId))
        .send({
            token: 'asdf',
            orderId: order.id
        })
        .expect(400);
});

it('returns a 204 with valid inputs', async () => {
    const app = createApp(appConfig);
    const order = await createOrder();

    const response = await await request(app)
        .post('/api/payments')
        .set('Cookie', signin(appConfig, order.userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.currency).toEqual('usd');
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(order.price * 100);

    const payment = await Payment.findOne({ orderId: order.id });
    expect(payment).not.toBeNull();
});
