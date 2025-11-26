import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * API Client para comunicação com o backend AICredy
 */
class APIClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('Usuário não autenticado');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(error.message || `Erro ${response.status}`);
    }

    return response.json();
  }

  // ==================== AGENTS ====================
  async getAgents(): Promise<Agent[]> {
    return this.request('/v1/agents');
  }

  async getAgent(id: string): Promise<Agent> {
    return this.request(`/v1/agents/${id}`);
  }

  async createAgent(data: CreateAgentDto): Promise<Agent> {
    return this.request('/v1/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgent(id: string, data: Partial<CreateAgentDto>): Promise<Agent> {
    return this.request(`/v1/agents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(id: string): Promise<{ message: string }> {
    return this.request(`/v1/agents/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CHANNELS ====================
  async getChannels(): Promise<Channel[]> {
    return this.request('/v1/channels');
  }

  async createChannel(data: CreateChannelDto): Promise<Channel> {
    return this.request('/v1/channels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChannel(id: string, data: Partial<CreateChannelDto>): Promise<Channel> {
    return this.request(`/v1/channels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteChannel(id: string): Promise<{ message: string }> {
    return this.request(`/v1/channels/${id}`, {
      method: 'DELETE',
    });
  }

  // Gestão de agents em canais
  async getChannelAgents(channelId: string): Promise<ChannelAgent[]> {
    return this.request(`/v1/channels/${channelId}/agents`);
  }

  async addAgentsToChannel(channelId: string, agents: AddAgentToChannelDto[]): Promise<ChannelAgent[]> {
    return this.request(`/v1/channels/${channelId}/agents`, {
      method: 'POST',
      body: JSON.stringify({ agents }),
    });
  }

  async removeAgentFromChannel(channelId: string, agentId: string): Promise<{ message: string }> {
    return this.request(`/v1/channels/${channelId}/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  // ==================== CREDENTIALS ====================
  async getCredentials() {
    return this.request<Credential[]>('/v1/credentials');
  }

  async createCredential(data: CreateCredentialDto) {
    return this.request<Credential>('/v1/credentials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCredential(id: string) {
    return this.request(`/v1/credentials/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CONTACTS ====================
  async getContacts(params?: { status?: string }): Promise<Contact[]> {
    const query = params?.status ? `?status=${params.status}` : '';
    return this.request(`/v1/contacts${query}`);
  }

  async getKanbanCounts(): Promise<KanbanCounts> {
    return this.request('/v1/contacts/kanban/counts');
  }

  async getKanban(page: number = 1, pageSize: number = 50): Promise<KanbanData> {
    return this.request(`/v1/contacts/kanban?page=${page}&pageSize=${pageSize}`);
  }

  async getContact(id: string): Promise<Contact> {
    return this.request(`/v1/contacts/${id}`);
  }

  async getContactConversations(contactId: string): Promise<Conversation[]> {
    return this.request(`/v1/contacts/${contactId}/conversations`);
  }

  async getContactSimulations(contactId: string): Promise<Simulation[]> {
    return this.request(`/v1/contacts/${contactId}/simulations`);
  }

  async createContact(data: Partial<Contact>): Promise<Contact> {
    return this.request('/v1/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContact(id: string, data: Partial<CreateContactDto>): Promise<Contact> {
    return this.request(`/v1/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateContactStatus(id: string, status: string): Promise<Contact> {
    return this.request(`/v1/contacts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    return this.request(`/v1/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CONVERSATIONS ====================
  async toggleAiStatus(phone: string, active: boolean): Promise<{ phone: string; active: boolean; updated: number }> {
    return this.request('/v1/conversations/ai-status', {
      method: 'PATCH',
      body: JSON.stringify({ phone, active }),
    });
  }

  async searchConversations(searchTerm: string): Promise<any[]> {
    return this.request(`/v1/conversations/search?q=${encodeURIComponent(searchTerm)}`);
  }

  // ==================== DASHBOARD ====================
  async getRecentActivity(limit: number = 10) {
    return this.request<Activity[]>(`/v1/dashboard/activity?limit=${limit}`);
  }

  async getDashboardStats() {
    return this.request<DashboardStats>(`/v1/dashboard/stats`);
  }

  // ==================== SETTINGS ====================
  async getSettings() {
    return this.request<TenantSettings>('/v1/settings');
  }

  async getDefaultMessages() {
    return this.request<DefaultMessages>('/v1/settings/default-messages');
  }

  async updateDefaultMessages(messages: DefaultMessages) {
    return this.request<DefaultMessages>('/v1/settings/default-messages', {
      method: 'PATCH',
      body: JSON.stringify(messages),
    });
  }
}

// ==================== TYPES ====================
export interface Agent {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  model?: string;
  enabled_tools: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

export interface CreateAgentDto {
  name: string;
  instructions: string;
  model?: string;
  enabled_tools?: string[];
}

export interface Channel {
  id: string;
  name?: string;
  type: 'wizebot' | 'whatsapp' | 'telegram' | 'instagram';
  provider?: string;
  identifier: string;
  config: Record<string, any>;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface CreateChannelDto {
  type: 'wizebot' | 'whatsapp' | 'telegram' | 'instagram';
  provider?: string;
  identifier: string;
  config: Record<string, any>;
  default_agent_id?: string;
}

export interface ChannelAgent {
  id: string;
  channel_id: string;
  agent_id: string;
  priority: number;
  is_default: boolean;
  created_at: string;
  agents?: Agent;
}

export interface AddAgentToChannelDto {
  agent_id: string;
  priority?: number;
  is_default?: boolean;
}

export interface Credential {
  id: string;
  type: string;
  name: string;
  status: 'active' | 'deleted';
  created_at: string;
}

export interface CreateCredentialDto {
  type: string;
  name: string;
  config: Record<string, any>;
}

export interface Activity {
  id: string;
  type: string;
  entity: string;
  entityId: string;
  description: string;
  timestamp: string;
  payload?: Record<string, any>;
}

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalChannels: number;
  activeChannels: number;
  totalCredentials: number;
  totalMessages: number;
}

export interface Contact {
  id: string;
  tenant_id: string;
  channel_id?: string;
  name?: string;
  external_id?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  channel?: {
    id: string;
    type: string;
    identifier: string;
  };
  conversations?: Conversation[];
}

export interface Conversation {
  id: string;
  status: string;
  last_message_at?: string;
  current_agent?: {
    id: string;
    name: string;
  };
  messages?: Message[];
}

export interface Message {
  id: string;
  sender: string;
  direction: string;
  type: string;
  content: any;
  created_at: string;
}

export interface KanbanData {
  new: Contact[];
  analysis: Contact[];
  rejected: Contact[];
  approved: Contact[];
  closed: Contact[];
}

export interface KanbanCounts {
  new: number;
  analysis: number;
  rejected: number;
  approved: number;
  closed: number;
}

export interface CreateContactDto {
  channel_id?: string;
  name?: string;
  external_id?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  fields?: Record<string, any>;
}

export interface Simulation {
  id: string;
  tenant_id: string;
  contact_id: string;
  agent_id?: string;
  tool_used: string;
  provider: string;
  status: string;
  input: {
    cpf: string;
    cep: string;
    nome: string;
    dataNascimento: string;
    telefone: string;
  };
  output: {
    success: boolean;
    propostaId?: number;
    aprovado?: boolean;
    message?: string;
    situacaoDescricao?: string;
    motivos?: string[];
    valorAprovado?: number;
    parcelas?: number;
  };
  webhook_data?: {
    propostaId: number;
    situacaoDescricao: string;
    motivos?: string[];
    valorAprovado?: number;
    parcelas?: number;
    receivedAt: string;
  };
  error?: string;
  created_at: string;
}

export interface TenantSettings {
  id: string;
  name: string;
  slug: string;
  plan: string;
  metadata: Record<string, any>;
  default_messages: DefaultMessages;
}

export interface DefaultMessages {
  approved: string;
  rejected: string;
}

export const apiClient = new APIClient();
export const api = apiClient; // Alias para compatibilidade
