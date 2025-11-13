import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
import { registerSchema, loginSchema } from '../utils/validation.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://exzyywcdclgzafbqsfkg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4enl5d2NkY2xnemFmYnFzZmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzk5OTcsImV4cCI6MjA3ODM5OTk5N30.nvJ_9ltSuuQTBRxJ7W_McxJSv20uEL_St92CX0uPBFs';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (existingUser) {
      res.status(409).json({ error: 'E-mail já cadastrado' });
      return;
    }
    
    // Verificar CPF se fornecido
    if (data.cpf) {
      const existingCPF = await prisma.user.findUnique({
        where: { cpf: data.cpf },
      });
      
      if (existingCPF) {
        res.status(409).json({ error: 'CPF já cadastrado' });
        return;
      }
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    
    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        cpf: data.cpf,
        phone: data.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    
    logger.info('Novo usuário registrado', { userId: user.id, email: user.email });
    
    // Gerar tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });
    
    res.status(201).json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    
    // Tentar usar Prisma primeiro
    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });
      
      if (!user) {
        logger.warn('Tentativa de login com email inexistente', { email: data.email });
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }
      
      // Verificar senha
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      
      if (!isValidPassword) {
        logger.warn('Tentativa de login com senha incorreta', { email: data.email, userId: user.id });
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }
      
      logger.info('Login realizado com sucesso', { userId: user.id, email: user.email });
      
      // Gerar tokens
      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });
      
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
      return;
    } catch (prismaError: any) {
      // Se Prisma falhar, usar Supabase API como fallback
      logger.warn('Prisma connection failed, using Supabase API fallback for login', { error: prismaError.message });
      
      try {
        // Buscar usuário via Supabase API
        const tableNames = ['"User"', 'User', 'user'];
        let user = null;
        
        for (const tableName of tableNames) {
          try {
            const response = await fetch(
              `${SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(data.email)}&select=*`,
              {
                method: 'GET',
                headers: {
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            
            if (response.ok) {
              const users = await response.json();
              if (users && users.length > 0) {
                user = users[0];
                break;
              }
            }
          } catch (error) {
            continue;
          }
        }
        
        if (!user) {
          logger.warn('Tentativa de login com email inexistente (Supabase)', { email: data.email });
          res.status(401).json({ error: 'Credenciais inválidas' });
          return;
        }
        
        // Verificar senha
        const isValidPassword = await bcrypt.compare(data.password, user.password);
        
        if (!isValidPassword) {
          logger.warn('Tentativa de login com senha incorreta (Supabase)', { email: data.email, userId: user.id });
          res.status(401).json({ error: 'Credenciais inválidas' });
          return;
        }
        
        logger.info('Login realizado com sucesso (Supabase)', { userId: user.id, email: user.email });
        
        // Gerar tokens
        const accessToken = generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });
        
        res.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          accessToken,
          refreshToken,
        });
      } catch (supabaseError: any) {
        logger.error('Supabase API fallback also failed for login', { error: supabaseError.message });
        res.status(500).json({ 
          error: 'Erro ao fazer login',
          details: supabaseError.message 
        });
      }
    }
  } catch (error: any) {
    logger.error('Unexpected error in login', { error: error.message });
    res.status(500).json({ 
      error: 'Erro ao fazer login',
      details: error.message 
    });
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token não fornecido' });
      return;
    }
    
    try {
      const payload = verifyRefreshToken(refreshToken);
      
      // Verificar se o usuário ainda existe
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      
      if (!user) {
        res.status(401).json({ error: 'Usuário não encontrado' });
        return;
      }
      
      // Gerar novos tokens
      const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });
      const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });
      
      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      res.status(401).json({ error: 'Refresh token inválido ou expirado' });
      return;
    }
  } catch (error) {
    next(error);
  }
};
