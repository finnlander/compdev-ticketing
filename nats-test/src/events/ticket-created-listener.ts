import { Message } from 'node-nats-streaming';
import { Listener } from '../../../common/src/events/base-listener';
import { Subjects, TicketCreatedEvent } from 'udemy-ticketing-common';


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage = (data: TicketCreatedEvent['data'], msg: Message) => {
        console.log('Event data', data);
        msg.ack();
    };
}