import request from 'supertest';
import app from '../../app';

it('returns a 201 on successful signup', async () => {
    const email = 'test@test.com';
    const password = 'password';

    await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
        })
        .expect(201);

    const resp = await request(app)
        .post('/api/users/signin')
        .send({
            email,
            password,
        })
        .expect(200);

    expect(resp.get('Set-Cookie')).toBeDefined();
});

it('should prevent login with nonexistent user', async () => {
    const email = 'test@test.com';
    const password = 'password';

    await request(app)
        .post('/api/users/signin')
        .send({
            email,
            password,
        })
        .expect(400);
});

it('should prevent login with invalid password', async () => {
    const email = 'test@test.com';
    const password = 'password';

    await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email,
            password: `IN${password}VALID`,
        })
        .expect(400);
});
