import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BuzenaLogo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
           <BuzenaLogo className="h-12 w-auto text-primary" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
              Acesse sua conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
               <Link href="/dashboard" className="w-full">
                <Button className="w-full" type="submit">
                  Entrar
                </Button>
              </Link>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link href="#" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
