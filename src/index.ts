import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import { getUsers } from './controllers/userController';
import purchaseRoutes from './routes/purchaseRoutes';
import { corsMiddleware } from './middleware/cors.middleware';

const app: Application = express();
const port: number = 8080;

// Middlewares
app.use(corsMiddleware);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/users', getUsers);

app.use('/', purchaseRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
