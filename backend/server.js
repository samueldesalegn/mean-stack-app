import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';
import medicationsRouter from './medications/medications.router.js';
import usersRouter from './users/users.router.js';
import { ErrorResponse } from './error.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Required for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

(async function () {
    try {
        if (process.env.DB_SERVER_URL) {
            await mongoose.connect(process.env.DB_SERVER_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB server is connected successfully');
        } else {
            throw new Error('DB server URL is not found');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
})();

app.use(cors());
app.use(morgan('dev'));
app.use(json());

// Static files
app.use('/medications/images', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/users', usersRouter);
app.use('/medications', medicationsRouter);

// Catch all unhandled requests
app.all('*', (req, res, next) => next(new ErrorResponse('Route not found', 404)));

// Error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ success: false, message: error.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express server is listening on port ${PORT}`));
