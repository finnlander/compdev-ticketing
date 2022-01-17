import {
    OrderCancelledEvent,
    Publisher,
    Subjects,
} from 'udemy-ticketing-common';

export default class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
