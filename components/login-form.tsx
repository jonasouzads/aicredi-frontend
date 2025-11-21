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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-display text-text-primary">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-body text-text-secondary">
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
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
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-text-primary">Senha</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm text-brand hover:text-brand-700 transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}
              <Button type="submit" className="btn-primary w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
            <div className="mt-6 text-center text-body text-text-secondary">
              Não tem uma conta?{" "}
              <Link
                href="/auth/sign-up"
                className="text-brand hover:text-brand-700 font-medium transition-colors"
              >
                Criar conta
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
