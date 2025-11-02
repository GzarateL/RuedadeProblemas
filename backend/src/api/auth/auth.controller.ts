import { Request, Response } from 'express';
import * as authService from './auth.service';

// --- REGISTRO LEGACY ---
export const registerUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const newUser = await authService.createUser(userData);
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userId: newUser.insertId
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// --- NUEVOS REGISTROS ESPECÍFICOS ---
export const registerAcademiaUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const newUser = await authService.createAcademiaUser(userData);
        res.status(201).json({
            message: 'Usuario de academia registrado exitosamente',
            userId: newUser.insertId
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const registerGobiernoUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        console.log('🔍 Datos recibidos para registro gobierno:', JSON.stringify(userData, null, 2));
        const newUser = await authService.createGobiernoUser(userData);
        res.status(201).json({
            message: 'Usuario de gobierno registrado exitosamente',
            userId: newUser.insertId
        });
    } catch (error: any) {
        console.log('❌ Error en registro gobierno:', error.message);
        res.status(400).json({ message: error.message });
    }
};

export const registerEmpresaUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const newUser = await authService.createEmpresaUser(userData);
        res.status(201).json({
            message: 'Usuario de empresa registrado exitosamente',
            userId: newUser.insertId
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const registerSociedadCivilUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const newUser = await authService.createSociedadCivilUser(userData);
        res.status(201).json({
            message: 'Usuario de sociedad civil registrado exitosamente',
            userId: newUser.insertId
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const registerInternoUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const newUser = await authService.createInternoUser(userData);
        res.status(201).json({
            message: 'Usuario interno registrado exitosamente',
            userId: newUser.insertId
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// --- LOGIN ---
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.login(email, password);
        res.status(200).json({
            message: "Login exitoso",
            token: token,
            user: {
                id: user.id, // <-- CORREGIDO: Usar 'id'
                email: user.email,
                rol: user.rol,
                nombres_apellidos: user.nombres_apellidos,
            },
        });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

// --- VERIFICACIÓN DE TOKEN ---
export const verifyToken = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No se proveyó un token.' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token malformado.' });
        }
        const user = await authService.verify(token);
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

// --- OBTENER USUARIO ACTUAL ---
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No se proveyó un token.' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token malformado.' });
        }
        const user = await authService.verify(token);
        
        res.status(200).json(user);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

// --- OBTENER DÍAS DISPONIBLES (TEMPORAL) ---
export const getDias = async (req: Request, res: Response) => {
    try {
        const dias = await authService.getDias();
        res.status(200).json(dias);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};