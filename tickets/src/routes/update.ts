import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from 'udemy-ticketing-common';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const titleValidator = body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required');

const priceValidator = body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than zero');

router.put('/api/tickets/:id',
    requireAuth,
    [titleValidator, priceValidator],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket');
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        ticket.set({ title, price });
        const updatedTicket = await ticket.save();

        console.log('Publishing event');
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });

        return res.status(200).send(updatedTicket);
    });

export { router as updateTicketRouter };
