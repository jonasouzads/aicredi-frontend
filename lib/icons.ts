/**
 * Mapeamento centralizado de ícones Flaticon
 * para manter consistência visual em todo o app
 */

export const CHANNEL_ICONS = {
  whatsapp: 'fi-brands-whatsapp',
  wizebot: 'fi-rr-robot',
  telegram: 'fi-brands-telegram',
  instagram: 'fi-brands-instagram',
  facebook: 'fi-brands-facebook',
  default: 'fi-rr-comment-alt'
} as const;

export const CREDENTIAL_ICONS = {
  crefaz: 'fi-rr-credit-card',
  wizebot: 'fi-rr-robot',
  mercadopago: 'fi-rr-money',
  fgts_api: 'fi-rr-bank',
  gestorpay: 'fi-rr-wallet',
  default: 'fi-rr-key'
} as const;

export const STATUS_ICONS = {
  active: 'fi-rr-check-circle',
  inactive: 'fi-rr-cross-circle',
  pending: 'fi-rr-time-forward',
  error: 'fi-rr-exclamation',
  success: 'fi-rr-check',
  warning: 'fi-rr-triangle-warning'
} as const;

export const AGENT_ICONS = {
  default: 'fi-rr-robot',
  customer_service: 'fi-rr-headset',
  sales: 'fi-rr-chart-line-up',
  support: 'fi-rr-life-ring'
} as const;

/**
 * Helper para obter ícone de canal
 */
export function getChannelIcon(type: string): string {
  return CHANNEL_ICONS[type as keyof typeof CHANNEL_ICONS] || CHANNEL_ICONS.default;
}

/**
 * Helper para obter ícone de credencial
 */
export function getCredentialIcon(type: string): string {
  return CREDENTIAL_ICONS[type as keyof typeof CREDENTIAL_ICONS] || CREDENTIAL_ICONS.default;
}

/**
 * Helper para obter ícone de status
 */
export function getStatusIcon(status: string): string {
  return STATUS_ICONS[status as keyof typeof STATUS_ICONS] || STATUS_ICONS.pending;
}

/**
 * Helper para obter ícone de agent
 */
export function getAgentIcon(type?: string): string {
  return AGENT_ICONS[type as keyof typeof AGENT_ICONS] || AGENT_ICONS.default;
}
