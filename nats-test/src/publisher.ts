import nats from 'node-nats-streaming';
import TicketCreatedPublisher from './events/ticket-created-publisher';

const clusterId = 'ticketing';
const clientId = 'abc';
const natsServerUrl = 'http://localhost:4222';

console.clear();

const stan = nats.connect(clusterId, clientId, {
    url: natsServerUrl,
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20,
            userId: 'tst',
        });
    } catch (error) {
        console.log(error);
    }
});
