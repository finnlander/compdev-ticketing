import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

/*
declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>
        }
    }
}

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const authResp = await request(app)
        .post('/api/users/signup')
        .send({ email, password })
        .expect(201);

    const sessionCookie = authResp.get('Set-Cookie');
    return sessionCookie;
}
*/
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'secret';
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
