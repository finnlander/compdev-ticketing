/**
 * Mock implementation for Stripe. Add functions per need.
 */
const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({ id: 'asdf' }),
    },
};

export default stripe;
