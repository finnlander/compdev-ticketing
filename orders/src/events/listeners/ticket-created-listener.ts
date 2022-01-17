import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from 'udemy-ticketing-common';
import Ticket from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;

    queueGroupName = queueGroupName;

    // eslint-disable-next-line class-methods-use-this
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;

        await Ticket.build({
            id,
            title,
            price,
        }).save();

        msg.ack();
    }
}
