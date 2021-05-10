import { PaymentCreatedEvent, Publisher, Subjects } from 'udemy-ticketing-common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}