import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from 'udemy-ticketing-common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;

        const ticket = await Ticket.build({
            id,
            title,
            price
        }).save();

        msg.ack();
    }
}