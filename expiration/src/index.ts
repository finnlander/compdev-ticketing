import { Stan } from 'node-nats-streaming';
import { Subjects } from 'udemy-ticketing-common';
import OrderCreatedListener from './events/listeners/order-created-listener';
import natsWrapper from './nats-wrapper';

const requiredEnvVars = [
    'NATS_URL',
    'NATS_CLUSTER_ID',
    'NATS_CLIENT_ID',
    'REDIS_HOST',
];

const start = async () => {
    console.log('Starting app...');
    verifyRequiredEnvVars();

    await initNats();
    startNatsListeners(natsWrapper.client);
};

start();

async function initNats() {
    const natsClusterId = process.env.NATS_CLUSTER_ID!;
    const clientId = process.env.NATS_CLIENT_ID!;
    const natsUrl = process.env.NATS_URL!;

    console.log('NATS config', { natsClusterId, clientId, natsUrl });
    await natsWrapper.connect(natsClusterId, clientId, natsUrl);
    natsWrapper.client.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });
    ['SIGINT', 'SIGTERM'].forEach((terminationSignal) =>
        process.on(terminationSignal, () => natsWrapper.client.close)
    );
}

function startNatsListeners(natsClient: Stan) {
    const listeners: { subject: Subjects; listen: () => void }[] = [
        new OrderCreatedListener(natsClient),
    ];

    listeners.forEach((listener) => {
        listener.listen();
        console.log('Started listening event: ', listener.subject);
    });
}

function verifyRequiredEnvVars() {
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable '${envVar}' must be defined`);
        }
    });
}
