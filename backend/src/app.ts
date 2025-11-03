// /backend/src/app.ts
import express from 'express';
import cors from 'cors';
import path from 'path'; // <--- FALTA ESTA LÍNEA (Importa el módulo path)

import authRoutes from './api/auth/auth.routes';
import cronogramaRoutes from './api/cronograma/cronograma.routes'; // <-- NUEVO
import usersRoutes from './api/users/users.routes';
import matchingRoutes from './api/matching/matching.routes';
import solicitudesRoutes from './api/solicitudes/solicitudes.routes';
import chatsRoutes from './api/chats/chats.routes';
import { heliceInternaRoutes } from './api/helice-interna/helice-interna.routes';
import heliceExternaRoutes from './api/helice-externa/helice-externa.routes';
import desafiosRoutes from './api/desafios/desafios.routes';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'https://ruedadeproblemas-backend.onrender.com'],
  credentials: true
}));
app.use(express.json());

// --- SERVIR ARCHIVOS ESTÁTICOS (Adjuntos subidos) --- // <--- AÑADE ESTA SECCIÓN
const uploadsPath = path.join(__dirname, '../../uploads');
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD?.length);
console.log('DB_PASSWORD has spaces?', /\s/.test(process.env.DB_PASSWORD || ''));
console.log(`Sirviendo archivos estáticos desde: ${uploadsPath}`); // Log para depuración
app.use('/uploads', express.static(uploadsPath));
// --- FIN SERVIR ARCHIVOS ESTÁTICOS --- // <--- HASTA AQUÍ

// --- RUTAS DE API ---
// (Tus rutas existentes están bien)
app.use('/api/auth', authRoutes);
app.use('/api/cronograma', cronogramaRoutes);
app.use('/api/users', usersRoutes); // <-- NUEVO
app.use('/api/matches', matchingRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/helice-interna', heliceInternaRoutes);
app.use('/api/helice-externa', heliceExternaRoutes);
app.use('/api/desafios', desafiosRoutes);

export default app;