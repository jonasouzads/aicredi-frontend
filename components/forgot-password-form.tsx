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
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="border-0 shadow-soft">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fi fi-rr-envelope text-3xl text-brand"></i>
            </div>
            <CardTitle className="text-display text-text-primary">Verifique seu e-mail</CardTitle>
            <CardDescription className="text-body text-text-secondary">
              Instruções de redefinição de senha enviadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body text-text-secondary text-center mb-6">
              Se você se registrou usando seu e-mail e senha, receberá um e-mail com instruções para redefinir sua senha.
            </p>
            <Link href="/auth/login" className="btn-primary w-full block text-center">
              Voltar para login
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-display text-text-primary">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-body text-text-secondary">
              Digite seu e-mail e enviaremos um link para redefinir sua senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
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
                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}
                <Button type="submit" className="btn-primary w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar e-mail de redefinição"}
                </Button>
              </div>
              <div className="mt-6 text-center text-body text-text-secondary">
                Lembrou sua senha?{" "}
                <Link
                  href="/auth/login"
                  className="text-brand hover:text-brand-700 font-medium transition-colors"
                >
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
