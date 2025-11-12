import QRCode from 'qrcode';
import crypto from 'crypto';

// Gerar hash único para o QR code baseado no código do ingresso
export const generateQRCodeData = (ticketCode: string, ticketId: string): string => {
  // Criar hash seguro do código do ingresso + ID
  const secret = process.env.JWT_SECRET || 'secret';
  const data = `${ticketId}:${ticketCode}:${secret}`;
  const hash = crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
  
  // Combinar ID + código + hash para validação
  return `${ticketId}:${ticketCode}:${hash.slice(0, 16)}`;
};

// Gerar QR code string único (para armazenar no banco)
export const generateQRCodeString = (ticketCode: string, ticketId: string): string => {
  return generateQRCodeData(ticketCode, ticketId);
};

// Gerar QR code como imagem base64
export const generateQRCodeImage = async (qrCodeString: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    throw new Error('Erro ao gerar QR code');
  }
};

// Validar QR code
export const validateQRCode = (qrData: string, ticketId: string, ticketCode: string): boolean => {
  try {
    const parts = qrData.split(':');
    
    if (parts.length !== 3) {
      return false;
    }
    
    const [id, code, hash] = parts;
    
    if (id !== ticketId || code !== ticketCode) {
      return false;
    }
    
    // Verificar hash
    const secret = process.env.JWT_SECRET || 'secret';
    const data = `${ticketId}:${ticketCode}:${secret}`;
    const expectedHash = crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
      .slice(0, 16);
    
    return hash === expectedHash;
  } catch (error) {
    return false;
  }
};
