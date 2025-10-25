import { CorsOptions } from 'cors';

/**
 * Configuración de CORS
 * ADVERTENCIA: origin: '*' permite CUALQUIER origen - usar solo en desarrollo
 * Para producción, especifica orígenes permitidos en ALLOWED_ORIGINS
 */
const corsConfig: CorsOptions = {
  origin: '*', // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400,
};

export default corsConfig;
