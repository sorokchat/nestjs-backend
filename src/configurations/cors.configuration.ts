import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsConfiguration(): CorsOptions {
  return {
    credentials: true,
    origin: [
      'http://localhost:4200',
      'https://angular-frontend-8s3s.onrender.com',
    ],
    exposedHeaders: ['WWW-Authenticate', 'Set-Cookie'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 3600,
  };
}
