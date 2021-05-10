import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const clusterId = 'ticketing';
const clientId = '' + randomBytes(4).toString('hex');
const natsServerUrl = 'http://localhost:4222';

const stan = nats.connect(clusterId, clientId, {
    url: natsServerUrl
});


stan.on('connect', () => {
    console.log('Listener connected to NATS');
    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    })

    new TicketCreatedListener(stan).listen();

});

['SIGINT', 'SIGTERM'].forEach(
    terminationSignal => process.on(terminationSignal, () => stan.close));


