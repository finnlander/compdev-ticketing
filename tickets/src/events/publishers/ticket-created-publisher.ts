import {
    Publisher,
    Subjects,
    TicketCreatedEvent,
} from 'udemy-ticketing-common';

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
