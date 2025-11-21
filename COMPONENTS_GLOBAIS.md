# 🎉 Componentes Globais - Toast e Confirmação

## ✅ **Implementado:**

Sistema completo de notificações (toasts) e diálogos de confirmação integrados em toda a aplicação.

---

## 📦 **Componentes Criados:**

### **1. Toast (Notificações)**
**Arquivo:** `components/ui/toast.tsx`

**Tipos:**
- ✅ Success (verde)
- ✅ Error (vermelho)
- ✅ Warning (amarelo)
- ✅ Info (azul)

**Recursos:**
- Auto-dismiss após 5 segundos
- Botão para fechar manualmente
- Ícones Flaticon
- Animação slide-in
- Responsivo (mobile-first)
- Empilhamento de múltiplos toasts

### **2. Confirm Dialog (Confirmação)**
**Arquivo:** `components/ui/confirm-dialog.tsx`

**Tipos:**
- ✅ Danger (vermelho) - Para deletar
- ✅ Warning (amarelo) - Para avisos
- ✅ Info (azul) - Para informações

**Recursos:**
- Modal com overlay
- Promise-based (async/await)
- Customizável (título, mensagem, botões)
- Ícones dinâmicos
- Animação zoom-in
- Responsivo

---

## 🎯 **Como Usar:**

### **Toast:**

```typescript
import { useToast } from '@/components/ui/toast';

function MyComponent() {
  const toast = useToast();

  // Success
  toast.success('Sucesso!', 'Operação concluída com sucesso.');

  // Error
  toast.error('Erro!', 'Algo deu errado.');

  // Warning
  toast.warning('Atenção!', 'Verifique os dados.');

  // Info
  toast.info('Informação', 'Dados atualizados.');
}
```

### **Confirm Dialog:**

```typescript
import { useConfirm } from '@/components/ui/confirm-dialog';

function MyComponent() {
  const { confirm } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Deletar Item',
      message: 'Tem certeza? Esta ação não pode ser desfeita.',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger',
    });

    if (confirmed) {
      // Usuário confirmou
      await deleteItem();
    }
  };
}
```

---

## 🔧 **Integração:**

### **1. Layout Global**
**Arquivo:** `app/layout.tsx`

```typescript
<ToastProvider>
  <ConfirmProvider>
    {children}
  </ConfirmProvider>
</ToastProvider>
```

### **2. Agent Card**
- ✅ Confirmação antes de deletar
- ✅ Toast de sucesso ao deletar
- ✅ Toast de erro se falhar

### **3. Channel Card**
- ✅ Confirmação antes de deletar
- ✅ Toast de sucesso ao deletar
- ✅ Toast de erro se falhar

### **4. Credential Card**
- ✅ Confirmação antes de deletar
- ✅ Toast de sucesso ao deletar
- ✅ Toast de erro se falhar

### **5. Create Agent Modal**
- ✅ Toast de sucesso ao criar
- ✅ Toast de erro se falhar

### **6. Create Channel Modal**
- ✅ Toast de sucesso ao criar
- ✅ Toast de erro se falhar

### **7. Create Credential Modal**
- ✅ Toast de sucesso ao criar
- ✅ Toast de erro se falhar

---

## 🎨 **Estilos:**

### **Toast Success:**
```
Cor: Verde (#10B981)
Ícone: fi-rr-check-circle
Background: green-50
Border: green-200
```

### **Toast Error:**
```
Cor: Vermelho (#EF4444)
Ícone: fi-rr-cross-circle
Background: red-50
Border: red-200
```

### **Toast Warning:**
```
Cor: Amarelo (#F59E0B)
Ícone: fi-rr-exclamation
Background: yellow-50
Border: yellow-200
```

### **Toast Info:**
```
Cor: Azul (#407AFF)
Ícone: fi-rr-info
Background: brand-50
Border: brand-200
```

---

## 📱 **Responsividade:**

### **Toast:**
- Mobile: Full width com padding
- Desktop: Max-width 400px, fixed top-right

### **Confirm Dialog:**
- Mobile: Full width modal
- Desktop: Max-width 500px, centered

---

## ✅ **Exemplos de Uso:**

### **1. Deletar Agent:**
```typescript
const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Deletar Agent',
    message: `Tem certeza que deseja deletar "${agent.name}"?`,
    confirmText: 'Deletar',
    type: 'danger',
  });

  if (!confirmed) return;

  try {
    await deleteAgent(agent.id);
    toast.success('Agent deletado!', 'O agent foi removido.');
  } catch (error) {
    toast.error('Erro', 'Não foi possível deletar.');
  }
};
```

### **2. Criar Canal:**
```typescript
const handleSubmit = async (data) => {
  try {
    await createChannel(data);
    toast.success('Canal criado!', 'Canal conectado com sucesso.');
    onClose();
  } catch (error) {
    toast.error('Erro', error.message);
  }
};
```

### **3. Operação Genérica:**
```typescript
// Informação
toast.info('Processando', 'Aguarde...');

// Aviso
toast.warning('Atenção', 'Verifique os dados antes de continuar.');

// Sucesso
toast.success('Pronto!', 'Tudo certo.');

// Erro
toast.error('Ops!', 'Algo deu errado.');
```

---

## 🚀 **Benefícios:**

- ✅ **UX Melhorada:** Feedback visual imediato
- ✅ **Consistência:** Mesmo padrão em toda a app
- ✅ **Segurança:** Confirmação antes de ações destrutivas
- ✅ **Acessibilidade:** Mensagens claras e visíveis
- ✅ **Responsivo:** Funciona em todos os dispositivos
- ✅ **Customizável:** Fácil de adaptar

---

## 📊 **Fluxo de Uso:**

```
┌─────────────────────────────┐
│ Usuário clica em "Deletar"  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Confirm Dialog aparece      │
│ "Tem certeza?"              │
└──────────────┬──────────────┘
               │
         ┌─────┴─────┐
         │           │
    Confirma    Cancela
         │           │
         │           └──> Nada acontece
         │
         ▼
┌─────────────────────────────┐
│ Executa ação (delete)       │
└──────────────┬──────────────┘
               │
         ┌─────┴─────┐
         │           │
    Sucesso      Erro
         │           │
         │           ▼
         │    Toast Error
         │    "Não foi possível"
         │
         ▼
    Toast Success
    "Deletado com sucesso"
```

---

**Sistema de notificações 100% implementado!** ✅🎉
