import mongoose from 'mongoose';
import { TicketCreatedEvent } from 'udemy-ticketing-common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { createMockMessage } from '../../../test/testHelpers';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create only relevant functions for the mock message
    // @ts-ignore
    const msg = createMockMessage();

    return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

