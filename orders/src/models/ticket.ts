/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
// Allow param reassign as mongoose uses '_id' field for the records and it is renamed into more clear 'id' field.
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from 'udemy-ticketing-common';
import Order from './order';
import { TicketDoc } from './ticket-doc';

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            requred: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });

ticketSchema.statics.build = (attrs: TicketAttrs) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });

// not using arrow function in the next line required for binding the mongoose model properly with 'this' value.
// eslint-disable-next-line func-names
ticketSchema.methods.isReserved = async function () {
    // this === the ticket document instance having the method "isReserved"
    const existingOrder = await Order.findOne({
        ticket: this as TicketDoc,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });

    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export default Ticket;
