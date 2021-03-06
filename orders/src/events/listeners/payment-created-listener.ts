import { Message } from 'node-nats-streaming';
import {
    Listener,
    OrderStatus,
    PaymentCreatedEvent,
    Subjects,
} from 'udemy-ticketing-common';
import Order from '../../models/order';
import { queueGroupName } from './queue-group-name';

export default class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;

    queueGroupName = queueGroupName;

    // eslint-disable-next-line class-methods-use-this
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error(`Order (#${data.orderId}) not found`);
        }

        await order.set({ status: OrderStatus.Complete }).save();

        msg.ack();
    }
}
