"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-display text-text-primary">Criar conta</CardTitle>
          <CardDescription className="text-body text-text-secondary">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-text-primary">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-text-primary">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password" className="text-text-primary">Confirmar senha</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="input"
                  placeholder="Digite a senha novamente"
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}
              <Button type="submit" className="btn-primary w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </div>
            <div className="mt-6 text-center text-body text-text-secondary">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-brand hover:text-brand-700 font-medium transition-colors">
                Entrar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
