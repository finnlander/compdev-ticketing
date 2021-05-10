
import mongoose from 'mongoose';
import { Stan } from 'node-nats-streaming';
import { Subjects } from 'udemy-ticketing-common';
import { createApp } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { AppConfiguration, AppEnv } from './interfaces/app-configuration';
import { natsWrapper } from './nats-wrapper';

const port = 3000;

const requiredEnvVars = [
    'JWT_KEY',
    'MONGO_URI',
    'NATS_URL',
    'NATS_CLUSTER_ID',
    'NATS_CLIENT_ID'
]

const start = async () => {
    console.log('Starting app...');
    verifyRequiredEnvVars();

    const app = createApp(defaultConfig());

    await initNats();
    await initMongoose();
    startNatsListeners(natsWrapper.client);

    app.listen(port, () => {
        console.log('Listening on port', port);
    });
};

start();

async function initMongoose() {
    try {
        const dbConnStr = process.env.MONGO_URI!;


        await mongoose.connect(dbConnStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('Database connection established');

    } catch (err) {
        console.log('Db connection failed:', err);
    }
}

async function initNats() {
    const natsClusterId = process.env.NATS_CLUSTER_ID!;
    const clientId = process.env.NATS_CLIENT_ID!;
    const natsUrl = process.env.NATS_URL!;

    await natsWrapper.connect(natsClusterId, clientId, natsUrl);
    natsWrapper.client.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    ['SIGINT', 'SIGTERM'].forEach(
        terminationSignal => process.on(terminationSignal, () => natsWrapper.client.close));

}

function startNatsListeners(natsClient: Stan) {

    const listeners: { subject: Subjects, listen: () => void }[] = [
        new OrderCreatedListener(natsClient),
        new OrderCancelledListener(natsClient)
    ];

    listeners.forEach(listener => {
        listener.listen();
        console.log('Started listening event: ', listener.subject);
    });
}

function verifyRequiredEnvVars() {
    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable '${envVar}' must be defined`);
        }
    });
}

function defaultConfig(): AppConfiguration {
    const nodeEnv: string = process.env.NODE_ENV!;
    if (nodeEnv as keyof typeof AppEnv) {

    }
    const env: AppEnv = nodeEnv as keyof typeof AppEnv
        ? AppEnv[nodeEnv as keyof typeof AppEnv]
        : AppEnv.test;
    return {
        env,
        jwtKey: process.env.JWT_KEY!,
        mongoURI: process.env.MONGO_URI!
    };
}

