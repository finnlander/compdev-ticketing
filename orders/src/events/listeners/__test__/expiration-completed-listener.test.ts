import { ExpirationCompleteEvent, OrderStatus } from 'udemy-ticketing-common';
import Order from '../../../models/order';
import natsWrapper from '../../../nats-wrapper';
import {
    createMockMessage,
    createOrder,
    createTicket,
} from '../../../test/testHelpers';
import ExpirationCompleteListener from '../expiration-complete-listener';

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const ticket = await createTicket();
    const order = await createOrder(ticket);
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    };

    const msg = createMockMessage();

    return {
        listener,
        ticket,
        order,
        msg,
        data,
    };
};

it('updates the order status to cancelled', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.orderId);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
    const { listener, order, msg, data } = await setup();

    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const call = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
    const eventData = JSON.parse(call[1]);
    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
