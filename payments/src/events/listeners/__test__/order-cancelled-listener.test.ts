import { OrderCancelledEvent, OrderStatus } from 'udemy-ticketing-common';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { createMockMessage, createOrder, createRandomId } from '../../../test/testHelpers';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = await createOrder();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: createRandomId()
        }

    };

    const msg = createMockMessage();
    return { listener, data, msg, order }
};

it('updates the status of order', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});