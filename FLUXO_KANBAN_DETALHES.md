# 📋 Novo Fluxo: Detalhes do Contato → Chat

## 🎯 **OBJETIVO:**
Separar a visualização de detalhes do contato da conversa, criando um fluxo em duas etapas:
1. **Detalhes do Card**: Informações do contato, proposta e botão "Ver Conversa"
2. **Chat**: Conversas completas estilo WhatsApp

---

## 🔄 **FLUXO:**

```
Kanban Card (Click)
    ↓
ContactDetailsCard (Modal)
├── Nome, Telefone, Email
├── Status do Lead
├── Proposta (se existir)
├── Notas/Descrição
├── Informações Adicionais
└── [Botão: Ver Conversa] → ChatModal
    ↓
ChatModal (Modal)
├── Header com nome/telefone
├── Mensagens estilo WhatsApp
└── [Botão: Fechar] → Volta para Kanban
```

---

## 📦 **COMPONENTES:**

### **1. ContactDetailsCard** ✅
**Arquivo:** `components/kanban/contact-details-card.tsx`

**Exibe:**
- ✅ Avatar do contato (ícone azul)
- ✅ Nome, telefone, email
- ✅ Badge de status (Novo Lead, Em Atendimento, Concluído)
- ✅ Card de proposta (se existir `proposta_id`)
- ✅ Notas/Descrição (se existir)
- ✅ Informações adicionais (data de criação, canal)
- ✅ Botão "Ver Conversa" (primário)
- ✅ Botão "Fechar" (secundário)

**Props:**
```tsx
interface ContactDetailsCardProps {
  contact: Contact;
  onClose: () => void;
  onOpenChat: () => void;
}
```

---

### **2. ChatModal** ✅
**Arquivo:** `components/chat/chat-modal.tsx`

**Exibe:**
- ✅ Header clean com nome/telefone
- ✅ Mensagens estilo WhatsApp
- ✅ Fundo bege com padrão sutil
- ✅ Scroll automático para última mensagem

**Props:**
```tsx
interface ChatModalProps {
  contact: Contact;
  onClose: () => void;
}
```

---

## 🎨 **DESIGN:**

### **ContactDetailsCard:**
- **Container:** `rounded-2xl`, fundo branco
- **Header:** Avatar `rounded-xl` com `bg-brand-50`
- **Sections:** Cards com `bg-background` e `rounded-xl`
- **Badges:** Cores semânticas (info, warning, success)
- **Botões:** Primário (Ver Conversa) + Secundário (Fechar)

### **ChatModal:**
- **Header:** Branco, avatar azul, botão fechar `rounded-xl`
- **Chat:** Fundo bege (`#EFEAE2`)
- **Mensagens:** Branco (recebidas) / Verde claro (enviadas)

---

## 🔧 **IMPLEMENTAÇÃO:**

### **Página Kanban:**
```tsx
const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
const [showChat, setShowChat] = useState(false);

const handleViewDetails = (contact: Contact) => {
  setSelectedContact(contact);
};

const handleCloseDetails = () => {
  setSelectedContact(null);
  setShowChat(false);
};

const handleOpenChat = () => {
  setShowChat(true);
};

// Renderização:
{selectedContact && !showChat && (
  <ContactDetailsCard
    contact={selectedContact}
    onClose={handleCloseDetails}
    onOpenChat={handleOpenChat}
  />
)}

{selectedContact && showChat && (
  <ChatModal
    contact={selectedContact}
    onClose={handleCloseDetails}
  />
)}
```

---

## 🧪 **COMO TESTAR:**

1. **Abrir Kanban:**
   ```
   /dashboard/kanban
   ```

2. **Clicar em um Card:**
   - ✅ Abre `ContactDetailsCard`
   - ✅ Mostra informações do contato
   - ✅ Mostra proposta (se existir)
   - ✅ Mostra notas (se existir)

3. **Clicar em "Ver Conversa":**
   - ✅ Fecha `ContactDetailsCard`
   - ✅ Abre `ChatModal`
   - ✅ Mostra mensagens estilo WhatsApp

4. **Clicar em "Fechar" (Chat):**
   - ✅ Fecha `ChatModal`
   - ✅ Volta para Kanban

5. **Clicar em "Fechar" (Detalhes):**
   - ✅ Fecha `ContactDetailsCard`
   - ✅ Volta para Kanban

---

## ✅ **BENEFÍCIOS:**

1. **Separação de Responsabilidades:**
   - Detalhes do contato em um componente
   - Chat em outro componente
   - Código mais organizado

2. **UX Melhorada:**
   - Usuário vê primeiro as informações importantes
   - Chat é opcional (clique em "Ver Conversa")
   - Menos informação na tela de uma vez

3. **Performance:**
   - Chat só carrega quando necessário
   - Conversas não são buscadas até clicar em "Ver Conversa"

4. **Manutenibilidade:**
   - Componentes menores e focados
   - Fácil de testar individualmente
   - Fácil de modificar

---

## 📊 **ESTRUTURA DE ARQUIVOS:**

```
components/
├── chat/
│   ├── chat-modal.tsx           # Modal de chat
│   ├── chat-header.tsx          # Header do chat
│   └── chat-message-bubble.tsx  # Balão de mensagem
└── kanban/
    ├── contact-details-card.tsx # Detalhes do contato (NOVO)
    ├── kanban-card.tsx          # Card do Kanban
    ├── kanban-column.tsx        # Coluna do Kanban
    └── kanban-skeleton.tsx      # Loading state

app/
└── dashboard/
    └── kanban/
        └── page.tsx             # Página principal (atualizada)
```

---

**Fluxo implementado com sucesso!** 🎉
