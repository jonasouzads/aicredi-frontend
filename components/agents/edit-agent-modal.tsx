'use client';

import { useState, useEffect } from 'react';
import { useAgents } from '@/hooks/use-agents';
import { useToast } from '@/components/ui/toast';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Agent } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditAgentModalProps {
  agent: Agent;
  onClose: () => void;
}

const AVAILABLE_TOOLS = [
  { id: 'crefaz_criar_proposta', name: 'Criar Proposta Crefaz' },
];

export function EditAgentModal({ agent, onClose }: EditAgentModalProps) {
  const { updateAgent } = useAgents();
  const toast = useToast();
  const modalRef = useFocusTrap<HTMLDivElement>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: agent.name,
    instructions: agent.instructions,
    model: agent.model || 'gpt-4o',
    enabled_tools: agent.enabled_tools || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await updateAgent(agent.id, formData);
      toast.success('Agent atualizado!', `O agent "${formData.name}" foi atualizado com sucesso.`);
      onClose();
    } catch (error: any) {
      toast.error('Erro ao atualizar agent', error.message || 'Não foi possível atualizar o agent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTool = (toolId: string) => {
    setFormData(prev => ({
      ...prev,
      enabled_tools: prev.enabled_tools.includes(toolId)
        ? prev.enabled_tools.filter(t => t !== toolId)
        : [...prev.enabled_tools, toolId]
    }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-agent-title"
    >
      <div 
        ref={modalRef}
        className="modal-container-md p-8 overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="edit-agent-title" className="text-title text-text-primary">Editar Agent</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Fechar modal"
          >
            <i className="fi fi-rr-cross text-xl text-text-secondary" aria-hidden="true"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <Label htmlFor="name" className="text-text-primary mb-2 block">
              Nome do Agent *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Consultor de Crédito"
              className="input"
              required
              minLength={3}
            />
          </div>

          {/* Instructions */}
          <div>
            <Label htmlFor="instructions" className="text-text-primary mb-2 block">
              Instruções *
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Você é um especialista em..."
              className="min-h-[120px] resize-y"
              required
              minLength={10}
            />
            <p className="text-sm text-text-secondary mt-2">
              Descreva como o agent deve se comportar e responder
            </p>
          </div>

          {/* Model */}
          <div>
            <Label htmlFor="model" className="text-text-primary mb-2 block">
              Modelo
            </Label>
            <Select
              value={formData.model}
              onValueChange={(value) => setFormData({ ...formData, model: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o (Recomendado)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Mais rápido)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tools */}
          <div>
            <Label className="text-text-primary mb-3 block">
              Ferramentas Habilitadas
            </Label>
            <div className="space-y-2">
              {AVAILABLE_TOOLS.map((tool) => (
                <label
                  key={tool.id}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-brand-200 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.enabled_tools.includes(tool.id)}
                    onChange={() => toggleTool(tool.id)}
                    className="w-5 h-5 text-brand rounded focus:ring-brand"
                  />
                  <span className="text-body text-text-primary">{tool.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
