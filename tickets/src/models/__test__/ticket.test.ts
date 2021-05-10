import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
    // Create a ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    }).save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first ticket
    await firstInstance!.save();

    // try saving the second ticket with outdated version
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();
    }

    throw new Error('Expected VersionError');

});

it('increments the version number on multiple saves', async () => {
    // Create a ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    }).save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);


    await ticket.save();
    expect(ticket.version).toEqual(2);
});