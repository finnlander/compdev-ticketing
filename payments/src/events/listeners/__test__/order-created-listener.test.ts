import { OrderCreatedEvent, OrderStatus } from 'udemy-ticketing-common';
import Order from '../../../models/order';
import natsWrapper from '../../../nats-wrapper';
import { createMockMessage, createRandomId } from '../../../test/testHelpers';
import OrderCreatedListener from '../order-created-listener';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: createRandomId(),
        version: 0,
        expiresAt: new Date().toISOString(),
        userId: createRandomId(),
        status: OrderStatus.Created,
        ticket: {
            id: createRandomId(),
            price: 10,
        },
    };

    const msg = createMockMessage();
    return { listener, data, msg };
};

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
