import mongoose from 'mongoose';
import { createJwtFromUser, UserPayload } from 'udemy-ticketing-common';
import { AppConfiguration, AppEnv } from '../interfaces/app-configuration';

const signin: (config: AppConfiguration) => string = (
    config: AppConfiguration
) => {
    const sessionKey = 'session';
    const { jwtKey } = config;

    // build a JWT payload. {id, email}
    const payload: UserPayload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };

    // Create the JWT
    const jwt = createJwtFromUser(payload, jwtKey);
    // Build session object {jwt: MY_JWT}
    const session = { jwt };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Encode JSON as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return `${sessionKey}=${base64}`;
};

const testAppConfig: () => AppConfiguration = () => ({
    env: AppEnv.test,
    jwtKey: 'secret',
    mongoURI: '',
});

export { signin, testAppConfig };
