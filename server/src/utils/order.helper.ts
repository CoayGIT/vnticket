import { randomBytes } from 'crypto';

export const generateTicketCode = (): string => {
  const prefix = 'VN';
  const randomPart = randomBytes(8).toString('hex').toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}-${randomPart}`;
};
