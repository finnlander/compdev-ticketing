import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError, OrderStatus, requireAuth, validateRequest } from 'udemy-ticketing-common';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECS = 1 * 60;

const ticketIdValidator = body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided');

router.post('/api/orders',
    requireAuth,
    [
        ticketIdValidator
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new BadRequestError('Ticket not found');
        }

        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Ticket already reserved')
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECS);

        const order = Order.build({
            userId: req.currentUser!.id!,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket
        });

        await order.save();
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });

        res.status(201).send(order);
    });

export { router as createOrderRouter };
