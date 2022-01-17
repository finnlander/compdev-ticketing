import mongoose from 'mongoose';
import { OrderStatus } from 'udemy-ticketing-common';
import { TicketDoc } from './ticket-doc';

/**
 * Mongoose document model for order.
 */
export interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}
