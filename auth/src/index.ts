import mongoose from 'mongoose';
import app from './app';

const port = 3000;

const requiredEnvVars = ['JWT_KEY', 'MONGO_URI'];

const start = async () => {
    console.log('Starting app...');
    verifyRequiredEnvVars();

    try {
        const dbConnStr = process.env.MONGO_URI!;
        await mongoose.connect(dbConnStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        console.log('Database connection established');
    } catch (err) {
        console.log('Db connection failed:', err);
    }
    app.listen(port, () => {
        console.log('v8');
        console.log('Listening on port', port);
    });
};

start();

function verifyRequiredEnvVars() {
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable '${envVar}' must be defined`);
        }
    });
}
