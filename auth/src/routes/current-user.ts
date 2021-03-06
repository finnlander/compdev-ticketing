import express from 'express';
import { currentUserMiddlewareCreator } from 'udemy-ticketing-common';

const currentUserMiddleware = currentUserMiddlewareCreator(
    process.env.JWT_KEY!
);

const router = express.Router();

router.get('/api/users/currentuser', currentUserMiddleware, (req, res) =>
    res.send({ currentUser: req.currentUser || null })
);

export default router;
