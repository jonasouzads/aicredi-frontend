# ✅ Integração Backend 100% Completa

## 🎯 **Status:** Totalmente Integrado

Todos os endpoints do backend estão mapeados e funcionando no frontend.

---

## 📊 **Endpoints Implementados:**

### **1. Agents** (`/v1/agents`)

| Método | Endpoint | Função | Hook |
|--------|----------|--------|------|
| GET | `/v1/agents` | Listar todos | `useAgents().agents` |
| GET | `/v1/agents/:id` | Buscar por ID | `useAgents().getAgent(id)` |
| POST | `/v1/agents` | Criar novo | `useAgents().createAgent(data)` |
| PATCH | `/v1/agents/:id` | Atualizar | `useAgents().updateAgent(id, data)` |
| DELETE | `/v1/agents/:id` | Deletar | `useAgents().deleteAgent(id)` |

**DTO:**
```typescript
interface CreateAgentDto {
  name: string;
  instructions: string;
  model?: string; // default: 'gpt-4o'
  enabled_tools?: string[];
}
```

---

### **2. Channels** (`/v1/channels`)

| Método | Endpoint | Função | Hook |
|--------|----------|--------|------|
| GET | `/v1/channels` | Listar todos | `useChannels().channels` |
| POST | `/v1/channels` | Criar novo | `useChannels().createChannel(data)` |
| DELETE | `/v1/channels/:id` | Deletar | `useChannels().deleteChannel(id)` |
| GET | `/v1/channels/:id/agents` | Listar agents do canal | `useChannels().getChannelAgents(id)` |
| POST | `/v1/channels/:id/agents` | Adicionar agents | `useChannels().addAgentsToChannel(id, agents)` |
| DELETE | `/v1/channels/:id/agents/:agentId` | Remover agent | `useChannels().removeAgentFromChannel(id, agentId)` |

**DTO:**
```typescript
interface CreateChannelDto {
  type: 'wizebot' | 'whatsapp' | 'telegram' | 'instagram';
  provider?: string;
  identifier: string;
  config: Record<string, any>;
  default_agent_id?: string;
}

interface AddAgentToChannelDto {
  agent_id: string;
  priority?: number;
  is_default?: boolean;
}
```

---

### **3. Credentials** (`/v1/credentials`)

| Método | Endpoint | Função | Hook |
|--------|----------|--------|------|
| GET | `/v1/credentials` | Listar todos | `useCredentials().credentials` |
| POST | `/v1/credentials` | Criar novo | `useCredentials().createCredential(data)` |
| DELETE | `/v1/credentials/:id` | Deletar | `useCredentials().deleteCredential(id)` |

**DTO:**
```typescript
interface CreateCredentialDto {
  type: 'crefaz' | 'wizebot' | 'mercadopago' | 'fgts_api' | 'gestorpay';
  name: string;
  config: Record<string, any>;
}

// Exemplo Crefaz:
{
  type: 'crefaz',
  name: 'Crefaz Produção',
  config: {
    login: 'CC00000000',
    senha: 'sua_senha',
    apiKey: 'sua_api_key',
    environment: 'production' | 'staging'
  }
}
```

---

## 🔧 **Arquitetura:**

### **API Client** (`lib/api.ts`)
```typescript
class APIClient {
  private async getAuthHeaders() {
    // Pega token JWT do Supabase
    const session = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session.access_token}`
    };
  }

  private async request<T>(endpoint, options) {
    // Faz request com auth headers
    // Trata erros automaticamente
  }
}

export const apiClient = new APIClient();
```

### **Hooks Customizados**

#### **useAgents()**
```typescript
const {
  agents,           // Agent[]
  loading,          // boolean
  error,            // string | null
  getAgent,         // (id) => Promise<Agent>
  createAgent,      // (data) => Promise<Agent>
  updateAgent,      // (id, data) => Promise<Agent>
  deleteAgent,      // (id) => Promise<void>
  refetch,          // () => Promise<void>
} = useAgents();
```

#### **useChannels()**
```typescript
const {
  channels,                  // Channel[]
  loading,                   // boolean
  error,                     // string | null
  createChannel,             // (data) => Promise<Channel>
  deleteChannel,             // (id) => Promise<void>
  getChannelAgents,          // (id) => Promise<ChannelAgent[]>
  addAgentsToChannel,        // (id, agents) => Promise<ChannelAgent[]>
  removeAgentFromChannel,    // (channelId, agentId) => Promise<void>
  refetch,                   // () => Promise<void>
} = useChannels();
```

#### **useCredentials()**
```typescript
const {
  credentials,        // Credential[]
  loading,            // boolean
  error,              // string | null
  createCredential,   // (data) => Promise<Credential>
  deleteCredential,   // (id) => Promise<void>
  refetch,            // () => Promise<void>
} = useCredentials();
```

---

## 🔐 **Autenticação:**

### **Fluxo:**
1. Usuário faz login via Supabase
2. Supabase retorna JWT token
3. API Client pega o token automaticamente
4. Todas as requests incluem: `Authorization: Bearer <token>`
5. Backend valida token com `SupabaseAuthGuard`
6. Backend extrai `tenantId` do usuário
7. Todas as queries filtram por `tenant_id`

### **Isolamento de Dados:**
- Cada request é automaticamente filtrado pelo `tenantId`
- Usuários só veem seus próprios dados
- Implementado via RLS (Row Level Security) no Supabase

---

## 📝 **Exemplo de Uso:**

### **Criar Agent:**
```typescript
import { useAgents } from '@/hooks/use-agents';

function CreateAgentForm() {
  const { createAgent } = useAgents();

  const handleSubmit = async (e) => {
    try {
      await createAgent({
        name: 'Consultor de Crédito',
        instructions: 'Você é um especialista...',
        model: 'gpt-4o',
        enabled_tools: ['crefaz_criar_proposta']
      });
      // Lista é recarregada automaticamente
    } catch (error) {
      alert(error.message);
    }
  };
}
```

### **Deletar Channel:**
```typescript
import { useChannels } from '@/hooks/use-channels';

function ChannelCard({ channel }) {
  const { deleteChannel } = useChannels();

  const handleDelete = async () => {
    if (confirm('Deletar canal?')) {
      try {
        await deleteChannel(channel.id);
        // Lista é recarregada automaticamente
      } catch (error) {
        alert(error.message);
      }
    }
  };
}
```

### **Adicionar Agent ao Canal:**
```typescript
import { useChannels } from '@/hooks/use-channels';

function ManageChannelAgents({ channelId }) {
  const { addAgentsToChannel } = useChannels();

  const handleAdd = async (agentId) => {
    try {
      await addAgentsToChannel(channelId, [
        {
          agent_id: agentId,
          priority: 0,
          is_default: true
        }
      ]);
    } catch (error) {
      alert(error.message);
    }
  };
}
```

---

## ✅ **Checklist de Integração:**

### **Agents:**
- ✅ GET /v1/agents - Listar
- ✅ GET /v1/agents/:id - Buscar
- ✅ POST /v1/agents - Criar
- ✅ PATCH /v1/agents/:id - Atualizar
- ✅ DELETE /v1/agents/:id - Deletar
- ✅ Hook useAgents()
- ✅ Componentes integrados
- ✅ Auto-refresh após operações

### **Channels:**
- ✅ GET /v1/channels - Listar
- ✅ POST /v1/channels - Criar
- ✅ DELETE /v1/channels/:id - Deletar
- ✅ GET /v1/channels/:id/agents - Listar agents
- ✅ POST /v1/channels/:id/agents - Adicionar agents
- ✅ DELETE /v1/channels/:id/agents/:agentId - Remover agent
- ✅ Hook useChannels()
- ✅ Componentes integrados
- ✅ Auto-refresh após operações

### **Credentials:**
- ✅ GET /v1/credentials - Listar
- ✅ POST /v1/credentials - Criar
- ✅ DELETE /v1/credentials/:id - Deletar
- ✅ Hook useCredentials()
- ✅ Componentes integrados
- ✅ Auto-refresh após operações

### **Geral:**
- ✅ Autenticação JWT
- ✅ Error handling
- ✅ Loading states
- ✅ Auto-refresh
- ✅ Type safety (TypeScript)
- ✅ Isolamento por tenant

---

## 🚀 **Como Testar:**

### **1. Iniciar Backend:**
```bash
cd d:/aicredy
npm run start:dev
```

### **2. Iniciar Frontend:**
```bash
cd aicredy-frontend
npm run dev
```

### **3. Testar Endpoints:**

**Agents:**
1. Acesse http://localhost:3000/dashboard/agents
2. Clique em "Novo Agent"
3. Preencha o formulário
4. Clique em "Criar Agent"
5. Veja o agent na lista
6. Clique em "Deletar"
7. Confirme e veja o agent removido

**Channels:**
1. Acesse http://localhost:3000/dashboard/channels
2. Clique em "Novo Canal"
3. Selecione o tipo (WhatsApp, Wizebot, etc)
4. Preencha identificador
5. Clique em "Criar Canal"
6. Veja o canal na lista

**Credentials:**
1. Acesse http://localhost:3000/dashboard/credentials
2. Clique em "Nova Credencial"
3. Selecione tipo (Crefaz, etc)
4. Preencha dados
5. Clique em "Criar Credencial"
6. Veja a credencial na lista

---

## 📊 **Logs e Debug:**

### **Ver Requests:**
Abra DevTools → Network → Filter: Fetch/XHR

### **Ver Erros:**
Abra DevTools → Console

### **Backend Logs:**
```bash
# Terminal do backend mostra:
[Nest] LOG [AgentsController] GET /v1/agents
[Nest] LOG [AgentsService] findAll tenantId: xxx
```

---

**Integração 100% completa e testada!** ✅🎉
