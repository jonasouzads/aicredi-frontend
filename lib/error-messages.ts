/**
 * Traduções de mensagens de erro para português
 * Mapeia erros técnicos do Supabase para mensagens amigáveis
 */

export const errorMessages: Record<string, string> = {
  // Auth errors
  'Invalid login credentials': 'E-mail ou senha incorretos',
  'Email not confirmed': 'Por favor, confirme seu e-mail antes de fazer login',
  'User already registered': 'Este e-mail já está cadastrado',
  'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
  'Unable to validate email address': 'E-mail inválido',
  'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos',
  'Invalid email or password': 'E-mail ou senha incorretos',
  'Email link is invalid or has expired': 'Link expirado. Solicite um novo',
  'Token has expired or is invalid': 'Sessão expirada. Faça login novamente',
  'User not found': 'Usuário não encontrado',
  
  // Network errors
  'Failed to fetch': 'Erro de conexão. Verifique sua internet',
  'Network request failed': 'Erro de conexão. Tente novamente',
  'Timeout': 'Tempo esgotado. Tente novamente',
  
  // API errors
  'Unauthorized': 'Sessão expirada. Faça login novamente',
  'Forbidden': 'Você não tem permissão para esta ação',
  'Not Found': 'Recurso não encontrado',
  'Internal Server Error': 'Erro no servidor. Tente novamente em instantes',
  'Bad Request': 'Dados inválidos. Verifique as informações',
  
  // Generic
  'An error occurred': 'Ocorreu um erro. Tente novamente',
  'Unknown error': 'Erro desconhecido. Tente novamente',
};

/**
 * Traduz mensagem de erro técnica para mensagem amigável
 */
export function translateError(error: string | Error): string {
  const message = typeof error === 'string' ? error : error.message;
  
  // Buscar tradução exata
  if (errorMessages[message]) {
    return errorMessages[message];
  }
  
  // Buscar por substring
  for (const [key, value] of Object.entries(errorMessages)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Retornar mensagem genérica se não encontrar tradução
  return 'Ocorreu um erro. Tente novamente';
}

/**
 * Formata erro para exibição ao usuário
 */
export function formatError(error: unknown): string {
  if (!error) return 'Erro desconhecido';
  
  if (typeof error === 'string') {
    return translateError(error);
  }
  
  if (error instanceof Error) {
    return translateError(error.message);
  }
  
  if (typeof error === 'object' && 'message' in error) {
    return translateError((error as any).message);
  }
  
  return 'Ocorreu um erro inesperado';
}
