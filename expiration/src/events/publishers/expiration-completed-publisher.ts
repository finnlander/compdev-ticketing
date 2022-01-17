import {
    ExpirationCompleteEvent,
    Publisher,
    Subjects,
} from 'udemy-ticketing-common';

export default class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
