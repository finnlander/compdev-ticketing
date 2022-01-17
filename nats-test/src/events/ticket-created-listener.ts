import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from 'udemy-ticketing-common';

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;

    queueGroupName = 'payments-service';

    // eslint-disable-next-line class-methods-use-this
    onMessage = (data: TicketCreatedEvent['data'], msg: Message) => {
        console.log('Event data', data);
        msg.ack();
    };
}
