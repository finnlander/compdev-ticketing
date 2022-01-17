import request from 'supertest';
import app from '../../app';
import { signin } from '../../test/testHelpers';

it('responds with details about the current user', async () => {
    const email = 'test@test.com';

    const sessionCookie = await signin();
    const resp = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', sessionCookie)
        .send()
        .expect(200);

    expect(resp.body.currentUser.email).toEqual(email);
});

it('responds with null if not authenticated', async () => {
    const resp = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(resp.body.currentUser).toBeNull();
});
