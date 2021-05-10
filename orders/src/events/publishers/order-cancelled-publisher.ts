import { OrderCancelledEvent, Publisher, Subjects } from 'udemy-ticketing-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}