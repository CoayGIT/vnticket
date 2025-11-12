import { z } from 'zod';
import validator from 'validator';

// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

// Schemas de validação
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  cpf: z.string().refine(validateCPF, 'CPF inválido').optional(),
  phone: z.string().optional(),
});

export const createEventSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  location: z.string().min(3, 'Localização deve ter no mínimo 3 caracteres'),
  image: z.string().url('URL da imagem inválida'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  ticketTypes: z.array(z.object({
    name: z.string().min(1, 'Nome do tipo de ingresso é obrigatório'),
    price: z.number().positive('Preço deve ser positivo'),
    available: z.number().int().min(0, 'Disponibilidade deve ser um número positivo'),
  })).min(1, 'Pelo menos um tipo de ingresso é obrigatório'),
});

export const createOrderSchema = z.object({
  eventId: z.string().min(1, 'ID do evento é obrigatório'),
  ticketTypeId: z.string().min(1, 'ID do tipo de ingresso é obrigatório'),
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1').max(10, 'Quantidade máxima é 10'),
  buyerData: z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    cpf: z.string().refine(validateCPF, 'CPF inválido'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
  }),
});
