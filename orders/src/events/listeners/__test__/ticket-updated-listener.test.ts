import mongoose from 'mongoose';
import { TicketUpdatedEvent } from 'udemy-ticketing-common';
import Ticket from '../../../models/ticket';
import natsWrapper from '../../../nats-wrapper';
import { createMockMessage, createTicket } from '../../../test/testHelpers';
import TicketUpdatedListener from '../ticket-updated-listener';

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create an existing ticket
    const ticket = await createTicket();

    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'another concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // @ts-ignore
    const msg = createMockMessage();
    return {
        listener,
        ticket,
        data,
        msg,
    };
};

it('finds, updates, and saves a ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the message version is not valid', async () => {
    const { listener, data, msg } = await setup();

    const ticket = await Ticket.findById(data.id);
    await ticket!
        .set({
            price: 123,
        })
        .save();

    try {
        await listener.onMessage(data, msg);
        // eslint-disable-next-line no-empty
    } catch (versionError) {}

    expect(msg.ack).not.toHaveBeenCalled();
});
