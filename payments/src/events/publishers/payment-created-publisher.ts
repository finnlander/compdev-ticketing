import {
    PaymentCreatedEvent,
    Publisher,
    Subjects,
} from 'udemy-ticketing-common';

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
