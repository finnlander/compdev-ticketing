import express from 'express';
import { Session } from 'udemy-ticketing-common';

const router = express.Router();

declare global {
    namespace Express {
        interface Request {
            session?: Session;
        }
    }
}

router.post('/api/users/signout', (req, res) => {
    req.session = undefined;

    res.send({ currentUser: null });
});

export default router;
