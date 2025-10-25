import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import userRoutes from './routes/userRoutes';

const app: Application = express();
const port: number = 8080;

app.use(express.json());

app.use(express.json());

app.use('/users', userRoutes);
app.use('/', purchaseRoutes);

app.get('/health', (_, res: Response) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
