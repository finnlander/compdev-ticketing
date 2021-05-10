import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from 'udemy-ticketing-common';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        console.log('order created', data);

        const delay = Math.max(0, new Date(data.expiresAt).getTime() - new Date().getTime());


        if (delay > 0) {
            console.log(`Waiting ${delay} milliseconds to prcess the job`);
        }

        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: delay
        });

        msg.ack();
    }
}