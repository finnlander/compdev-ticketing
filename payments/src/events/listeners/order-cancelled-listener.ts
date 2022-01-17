import { Message } from 'node-nats-streaming';
import {
    Listener,
    OrderCancelledEvent,
    OrderStatus,
    Subjects,
} from 'udemy-ticketing-common';
import Order from '../../models/order';
import { queueGroupName } from './queue-group-name';

export default class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;

    queueGroupName = queueGroupName;

    // eslint-disable-next-line class-methods-use-this
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
        });

        if (!order) {
            throw new Error(`Order (#${data.id}) not found`);
        }

        await order
            .set({
                status: OrderStatus.Cancelled,
            })
            .save();

        msg.ack();
    }
}
