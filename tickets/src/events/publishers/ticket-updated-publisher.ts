import {
    Publisher,
    Subjects,
    TicketUpdatedEvent,
} from 'udemy-ticketing-common';

export default class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
