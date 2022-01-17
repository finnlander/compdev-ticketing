import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

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
    const collections = await mongoose.connection.db.collections();

    await Promise.all(
        collections.map((collection) => collection.deleteMany({}))
    );
});

afterAll(async () => {
    await mongo.stop();
});
