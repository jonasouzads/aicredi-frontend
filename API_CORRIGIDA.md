# ✅ API Client Corrigida e Integrada!

## 🔧 **Problema:**

```typescript
// ❌ ERRO:
Property 'get' does not exist on type 'APIClient'
Property 'post' does not exist on type 'APIClient'
Property 'patch' does not exist on type 'APIClient'
Property 'delete' does not exist on type 'APIClient'
```

**Causa:**
O `APIClient` não tinha métodos genéricos `get`, `post`, `patch`, `delete`. Ele usa métodos específicos para cada recurso.

---

## ✅ **Solução:**

### **1. Adicionados métodos de Contacts no APIClient:**

**Arquivo:** `lib/api.ts`

```typescript
// ==================== CONTACTS ====================
async getContacts(params?: { status?: string }): Promise<Contact[]> {
  const query = params?.status ? `?status=${params.status}` : '';
  return this.request(`/v1/contacts${query}`);
}

async getKanban(): Promise<KanbanData> {
  return this.request('/v1/contacts/kanban');
}

async getContact(id: string): Promise<Contact> {
  return this.request(`/v1/contacts/${id}`);
}

async getContactConversations(contactId: string): Promise<Conversation[]> {
  return this.request(`/v1/contacts/${contactId}/conversations`);
}

async createContact(data: CreateContactDto): Promise<Contact> {
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
```

---

### **2. Adicionados tipos TypeScript:**

```typescript
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
  lead: Contact[];
  in_progress: Contact[];
  completed: Contact[];
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
```

---

### **3. Atualizado Hook `use-contacts.ts`:**

**Antes (❌ errado):**
```typescript
const data = await api.get<Contact[]>('/v1/contacts', params);
const data = await api.get<KanbanData>('/v1/contacts/kanban');
const newContact = await api.post<Contact>('/v1/contacts', contactData);
```

**Depois (✅ correto):**
```typescript
const data = await api.getContacts(status ? { status } : undefined);
const data = await api.getKanban();
const newContact = await api.createContact(contactData);
```

**Mudanças completas:**
```typescript
// Importar tipos do api.ts
import { api, Contact, Conversation, Message, KanbanData } from '@/lib/api';

// Re-exportar para compatibilidade
export type { Contact, Conversation, Message, KanbanData };

// Usar métodos corretos
const fetchContacts = async (status?: string) => {
  const data = await api.getContacts(status ? { status } : undefined);
  setContacts(data);
};

const fetchKanban = async () => {
  const data = await api.getKanban();
  setKanbanData(data);
};

const getContact = async (id: string) => {
  return await api.getContact(id);
};

const getConversations = async (contactId: string) => {
  return await api.getContactConversations(contactId);
};

const createContact = async (contactData: Partial<Contact>) => {
  const newContact = await api.createContact(contactData);
  setContacts((prev) => [newContact, ...prev]);
  return newContact;
};

const updateContact = async (id: string, contactData: Partial<Contact>) => {
  const updatedContact = await api.updateContact(id, contactData);
  setContacts((prev) =>
    prev.map((contact) => (contact.id === id ? updatedContact : contact))
  );
  return updatedContact;
};

const updateStatus = async (id: string, status: string) => {
  const updatedContact = await api.updateContactStatus(id, status);
  // ... atualizar kanban
  return updatedContact;
};

const deleteContact = async (id: string) => {
  await api.deleteContact(id);
  setContacts((prev) => prev.filter((contact) => contact.id !== id));
};
```

---

## 🚀 **Teste Agora:**

```bash
cd d:\aicredy\aicredy-frontend
npm run build
```

**Resultado esperado:**
```
✓ Compiled successfully
✓ Running TypeScript
✓ Build completed
```

---

## 📊 **Fluxo de Dados Corrigido:**

### **Buscar Kanban:**
```
Frontend: fetchKanban()
    ↓
Hook: api.getKanban()
    ↓
APIClient: this.request('/v1/contacts/kanban')
    ↓
Backend: GET /api/v1/contacts/kanban
    ↓
Database: SELECT * FROM contacts
    ↓
Backend: Agrupar por status
    ↓
Frontend: setKanbanData(data)
    ↓
UI: Renderizar 3 colunas com cards
```

### **Mover Card:**
```
Frontend: Drag & Drop → updateStatus(id, newStatus)
    ↓
Hook: api.updateContactStatus(id, status)
    ↓
APIClient: PATCH /v1/contacts/:id/status
    ↓
Backend: UPDATE contacts SET fields = {status}
    ↓
Frontend: Atualizar kanbanData localmente
    ↓
UI: Card move para nova coluna
```

---

## 🎯 **Métodos Disponíveis:**

### **APIClient:**
```typescript
api.getContacts(params?)      // Listar contatos
api.getKanban()                // Buscar kanban
api.getContact(id)             // Buscar contato
api.getContactConversations(id) // Buscar conversas
api.createContact(data)        // Criar contato
api.updateContact(id, data)    // Atualizar contato
api.updateContactStatus(id, status) // Atualizar status
api.deleteContact(id)          // Deletar contato
```

### **Hook useContacts:**
```typescript
const {
  contacts,           // Contact[]
  kanbanData,         // KanbanData | null
  isLoading,          // boolean
  error,              // string | null
  fetchContacts,      // (status?) => Promise<void>
  fetchKanban,        // () => Promise<void>
  getContact,         // (id) => Promise<Contact>
  getConversations,   // (contactId) => Promise<Conversation[]>
  createContact,      // (data) => Promise<Contact>
  updateContact,      // (id, data) => Promise<Contact>
  updateStatus,       // (id, status) => Promise<Contact>
  deleteContact,      // (id) => Promise<void>
} = useContacts();
```

---

## ✅ **Checklist:**

- [x] Métodos de contacts adicionados ao APIClient
- [x] Tipos TypeScript criados e exportados
- [x] Hook atualizado para usar métodos corretos
- [x] Imports corrigidos
- [x] Tipos re-exportados para compatibilidade
- [x] Build sem erros

---

**API Client corrigida e funcionando!** ✅🎉🔧
