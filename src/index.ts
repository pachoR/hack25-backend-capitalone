import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import { getUsers } from './controllers/userController';
import purchaseRoutes from './routes/purchaseRoutes';

const app: Application = express();
const port: number = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/users', getUsers);

// Purchase routes
app.use('/', purchaseRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
