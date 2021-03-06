import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from 'udemy-ticketing-common';
import Order from '../../models/order';
import { queueGroupName } from './queue-group-name';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;

    queueGroupName = queueGroupName;

    // eslint-disable-next-line class-methods-use-this
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        await Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
        }).save();

        msg.ack();
    }
}
