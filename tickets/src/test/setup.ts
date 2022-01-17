import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.setTimeout(20000);
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    if (!mongoose.connection.db) {
        throw new Error('Mongodb not found');
    }

    const collections = await mongoose.connection.db.collections();

    await Promise.all(
        collections.map((collection) => collection.deleteMany({}))
    );
});

afterAll(async () => {
    if (mongoose.connection) {
        await mongoose.disconnect();
    }

    await mongo.stop();
    mongo = null;
});
