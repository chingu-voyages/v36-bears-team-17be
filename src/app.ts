import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectMongo } from './config/db';
import { errorHandler } from './middlewares/error';
import authRoutes from './routes/auth';
import postRoutes from './routes/post';
import uploadRoutes from './routes/upload';


const app = express();
connectMongo();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/ping', (req: Request, res: Response) => {
    res.send('pong');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
    console.log(`$$ ~ Server running on port ${PORT}`)
);

process.on('UnhandledRejection', (err, promise) => {
    console.log(`Error occured ${err.message}`);
    server.close(() => process.exit(1));
});
