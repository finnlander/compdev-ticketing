import { Publisher, Subjects, TicketUpdatedEvent } from 'udemy-ticketing-common';



export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}