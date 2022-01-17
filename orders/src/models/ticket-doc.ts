import mongoose from 'mongoose';

/**
 * Mongoose document model for ticket.
 */
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}
