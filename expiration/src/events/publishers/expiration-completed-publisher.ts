import { ExpirationCompleteEvent, Publisher, Subjects } from 'udemy-ticketing-common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;

}