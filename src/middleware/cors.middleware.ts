import cors from 'cors';
import corsConfig from '../config/cors.config';

export const corsMiddleware = cors(corsConfig);
