import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import serverlessHttp from 'serverless-http';
import app from '../../server/src/index.js';

// Wrapper do Express app para Netlify Functions
const handler = serverlessHttp(app, {
  binary: ['image/*', 'application/pdf'],
});

export const api: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  // Netlify Functions tem timeout de 10s (free) ou 26s (pro)
  // Ajustar context para não esperar resposta
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Adicionar variável de ambiente para indicar que está rodando no Netlify
  process.env.NETLIFY = 'true';
  
  const result = await handler(event, context);
  
  // Garantir que o resultado seja um HandlerResponse válido
  if (result && typeof result === 'object' && 'statusCode' in result) {
    return result as HandlerResponse;
  }
  
  // Fallback caso o resultado não seja válido
  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Internal server error' }),
  };
};

