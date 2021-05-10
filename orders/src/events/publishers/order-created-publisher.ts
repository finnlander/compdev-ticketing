import { OrderCreatedEvent, Publisher, Subjects } from 'udemy-ticketing-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}