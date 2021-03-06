import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from 'udemy-ticketing-common';
import Ticket from '../../models/ticket';
import TicketUpdatedPublisher from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;

    readonly queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // find associated ticket
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: data.id });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
        });

        msg.ack();
    }
}
