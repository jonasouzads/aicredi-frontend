import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-0 shadow-soft">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fi fi-rr-check text-3xl text-brand"></i>
              </div>
              <CardTitle className="text-display text-text-primary">
                Obrigado por se cadastrar!
              </CardTitle>
              <CardDescription className="text-body text-text-secondary">
                Verifique seu e-mail para confirmar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body text-text-secondary text-center mb-6">
                Você se cadastrou com sucesso. Por favor, verifique seu e-mail para confirmar sua conta antes de fazer login.
              </p>
              <Link href="/auth/login" className="btn-primary w-full block text-center">
                Ir para login
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
