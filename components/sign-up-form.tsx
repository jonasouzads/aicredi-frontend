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
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Criar conta
        </h1>
        <p className="text-text-secondary">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-text-primary">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 px-4 bg-background rounded-xl transition-all focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-text-primary">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 px-4 bg-background rounded-xl transition-all focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Repeat Password */}
        <div className="space-y-2">
          <Label htmlFor="repeat-password" className="text-sm font-medium text-text-primary">
            Confirmar senha
          </Label>
          <Input
            id="repeat-password"
            type="password"
            placeholder="Digite a senha novamente"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="h-12 px-4 bg-background rounded-xl transition-all focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-brand hover:bg-brand-600 text-white rounded-xl font-medium transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center text-sm text-text-secondary">
        Já tem uma conta?{" "}
        <Link
          href="/auth/login"
          className="text-brand hover:text-brand-600 font-medium transition-colors"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
