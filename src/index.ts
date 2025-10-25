import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import purchaseRoutes from './routes/purchaseRoutes';
import transferRoutes from './routes/transferRoutes';
import { corsMiddleware } from './middleware/cors.middleware';


const app: Application = express();
const port: number = 8080;

// Middlewares
app.use(corsMiddleware);
app.use(express.json());

app.use('/users', userRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/transfers', transferRoutes);

app.get('/health', (_, res: Response) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
