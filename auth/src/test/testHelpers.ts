import request from 'supertest';
import app from '../app';

export const signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const authResp = await request(app)
        .post('/api/users/signup')
        .send({ email, password })
        .expect(201);

    const sessionCookie = authResp.get('Set-Cookie');
    return sessionCookie;
};
