import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

// Router imports
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

// Public
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => res.send('hi there'));

app.get('/api/v1/test', (req, res) => {
	res.json({ msg: 'test route' });
});

app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.use('*', (req, res) => {
	res.status(404).json({ msg: 'Page not found.' });
});

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5100;

try {
	const connect = await mongoose.connect(process.env.MONGO_URL);
	console.log(`MongoDB connected: ${connect.connection.host}`);
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
} catch (error) {
	console.log(error);
	process.exit(1);
}
