import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest
} from 'udemy-ticketing-common';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';

const router = express.Router();

const tokenValidator = body('token')
    .not()
    .isEmpty();

const orderIdValidator = body('orderId')
    .not()
    .isEmpty()

router.post('/api/payments',
    requireAuth,
    [
        tokenValidator,
        orderIdValidator
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay a cancelled order');
        }

        const paymentRes = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        });

        const payment = await Payment.build({
            orderId: orderId,
            stripeId: paymentRes.id
        }).save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        res.status(201).send({ id: payment.id });
    });


export { router as createChareRouter };
