'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BuzenaLogo } from '@/components/logo';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { registerUser } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'cliente' as 'cliente' | 'entregador'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.userType
      );

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
           <BuzenaLogo className="h-12 w-auto text-primary" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
              Criar conta
            </CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de conta</Label>
                <RadioGroup 
                  value={formData.userType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value as 'cliente' | 'entregador' }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cliente" id="tipo_cliente" />
                    <Label htmlFor="tipo_cliente" className="cursor-pointer">Cliente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="entregador" id="tipo_entregador" />
                    <Label htmlFor="tipo_entregador" className="cursor-pointer">Entregador</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
              
               <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/" className="font-medium text-primary hover:underline">
                Entre
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}