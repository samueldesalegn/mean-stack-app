import AWS from 'aws-sdk';
import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
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

AWS.config.update({
    region: 'us-east-1',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(cors());
app.use(morgan('dev'));
app.use(json());

// Static files
app.use('/medications/images', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/users', usersRouter);
app.use('/medications', medicationsRouter);

// Catch all unhandled requests
app.all('*', async (req, res, next) => next(new ErrorResponse('Route not found', 404)));

// Error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ success: false, data: error.message });
});

app.listen(process.env.PORT, () => console.log(`Express server is listening on port ${process.env.PORT}`));
