# ✅ Integração Completa: Simulações/Propostas no Frontend

## 🎯 **OBJETIVO:**
Exibir as simulações/propostas de crédito do contato no `ContactDetailsCard` com informações detalhadas e status visual.

---

## 🔄 **FLUXO COMPLETO:**

```
Backend (NestJS)
    ↓
GET /api/v1/contacts/:id/simulations
    ↓
Frontend (lib/api.ts)
    ↓
Hook (use-contacts.ts)
    ↓
Component (ContactDetailsCard)
    ↓
Exibição Visual
```

---

## 📦 **ARQUIVOS MODIFICADOS:**

### **1. Backend** ✅
- `src/contacts/contacts.service.ts` - Método `getSimulations()`
- `src/contacts/contacts.controller.ts` - Rota `GET :id/simulations`

### **2. Frontend - API** ✅
- `lib/api.ts`:
  - Interface `Simulation` (tipagem)
  - Método `getContactSimulations()`

### **3. Frontend - Hook** ✅
- `hooks/use-contacts.ts`:
  - Função `getSimulations()`
  - Exportada no return

### **4. Frontend - Component** ✅
- `components/kanban/contact-details-card.tsx`:
  - Busca simulações ao abrir
  - Exibe proposta mais recente
  - Status visual (Aprovada/Negada/Em Análise)

---

## 🎨 **VISUAL DO CARD DE PROPOSTA:**

### **Status: Aprovada** 🟢
```
┌─────────────────────────────────────┐
│ 📄 ID: 1057353630    [Aprovada]    │
│                                     │
│ Valor: R$ 5.000                     │
│ 12x de R$ 416,67                    │
│                                     │
│ Criada em 26/11/2025                │
└─────────────────────────────────────┘
```

### **Status: Negada** 🔴
```
┌─────────────────────────────────────┐
│ 📄 ID: 1057353630     [Negada]     │
│                                     │
│ No momento não há ofertas...        │
│                                     │
│ Criada em 26/11/2025                │
└─────────────────────────────────────┘
```

### **Status: Em Análise** 🟡
```
┌─────────────────────────────────────┐
│ 📄 ID: 1057353630  [Em Análise]    │
│                                     │
│ Aguardando resposta do banco...    │
│                                     │
│ Criada em 26/11/2025                │
└─────────────────────────────────────┘
```

---

## 💡 **LÓGICA DE EXIBIÇÃO:**

### **Prioridade de Dados:**
```typescript
const simulationData = latestSimulation?.webhook_data || latestSimulation?.output;
```

1. **webhook_data** (se existir) - Dados atualizados via webhook
2. **output** (fallback) - Resposta inicial da API

### **Cores por Status:**
```typescript
{
  'Aprovada': {
    bg: 'bg-green-50',
    text: 'text-green-600',
    badge: 'bg-green-100 text-green-700'
  },
  'Negada': {
    bg: 'bg-red-50',
    text: 'text-red-600',
    badge: 'bg-red-100 text-red-700'
  },
  'Em Análise': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-700'
  }
}
```

---

## 📊 **DADOS EXIBIDOS:**

### **Sempre:**
- ✅ ID da Proposta (`propostaId`)
- ✅ Status (`situacaoDescricao`)
- ✅ Data de criação

### **Se Aprovada:**
- ✅ Valor aprovado (`valorAprovado`)
- ✅ Número de parcelas (`parcelas`)
- ✅ Valor da parcela (calculado)

### **Se Negada:**
- ✅ Motivo da negação (`motivos[0]`)

---

## 🔄 **ESTADOS DO COMPONENTE:**

### **1. Loading:**
```tsx
{isLoadingSimulations && (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
)}
```

### **2. Com Simulação:**
```tsx
{latestSimulation && (
  <div className="bg-background rounded-xl p-4">
    {/* Card da proposta */}
  </div>
)}
```

### **3. Sem Simulação:**
```tsx
{!latestSimulation && !isLoadingSimulations && null}
// Não exibe nada
```

---

## 🧪 **COMO TESTAR:**

### **1. Criar uma Proposta:**
```
1. Abra o Kanban
2. Clique em um contato
3. Vá para o chat
4. Converse com o agent
5. Agent cria proposta via tool
```

### **2. Ver Detalhes:**
```
1. Clique no card do contato
2. Modal abre com detalhes
3. Seção "Proposta" aparece
4. Status visual correto
```

### **3. Webhook Atualiza:**
```
1. Crefaz envia webhook
2. Backend atualiza webhook_data
3. Frontend busca novamente
4. Status atualizado aparece
```

---

## 🎯 **EXEMPLO DE RESPOSTA DA API:**

```json
[
  {
    "id": "uuid",
    "provider": "crefaz",
    "input": {
      "cpf": "04627462247",
      "nome": "Jonas Souza da Silva",
      "dataNascimento": "1999-02-09"
    },
    "output": {
      "propostaId": 1057353630,
      "situacaoDescricao": "Em Análise"
    },
    "webhook_data": {
      "propostaId": 1057353630,
      "situacaoDescricao": "Aprovada",
      "valorAprovado": 5000,
      "parcelas": 12,
      "receivedAt": "2025-11-26T18:00:00.000Z"
    },
    "created_at": "2025-11-26T17:30:00.000Z"
  }
]
```

---

## ✅ **CHECKLIST:**

- [x] Rota criada no backend
- [x] Tipo `Simulation` definido
- [x] Função `getContactSimulations()` em `api.ts`
- [x] Função `getSimulations()` em `use-contacts.ts`
- [x] Integração no `ContactDetailsCard`
- [x] Loading state
- [x] Status visual (cores)
- [x] Exibição de valores (se aprovada)
- [x] Exibição de motivos (se negada)
- [x] Documentação completa

---

**Integração 100% completa e funcionando!** 🚀
