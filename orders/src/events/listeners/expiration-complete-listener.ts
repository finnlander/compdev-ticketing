import { Message } from 'node-nats-streaming';
import {
    ExpirationCompleteEvent,
    Listener,
    OrderStatus,
    Subjects,
} from 'udemy-ticketing-common';
import Order from '../../models/order';
import natsWrapper from '../../nats-wrapper';
import OrderCancelledPublisher from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export default class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;

    queueGroupName = queueGroupName;

    // eslint-disable-next-line class-methods-use-this
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) {
            throw new Error(`Order (${data.orderId}) not found`);
        }

        if (order.status === OrderStatus.Complete) {
            msg.ack();
            return;
        }

        await order
            .set({
                status: OrderStatus.Cancelled,
            })
            .save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        });

        msg.ack();
    }
}
