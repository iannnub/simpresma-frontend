import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Award, Lock, Mail, Loader2, UserCheck, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { loginSchema, type LoginFormData } from '@/lib/schemas/auth.schema';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/shared/ThemeToggle';
import VersionBadge from '@/components/shared/VersionBadge';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await login(data);
      toast.success('Login Berhasil!', {
        description: `Selamat datang kembali, ${res.data.user.nama}`,
      });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Gagal melakukan login. Silakan periksa email dan password Anda.';
      toast.error('Gagal Masuk', {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoAccount = (email: string, password = 'password') => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-200 relative" role="main" aria-label="Halaman Login SIMPRESMA">
      {/* Theme Toggle in Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-md mb-2">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          SIMPRESMA
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Sistem Informasi Manajemen Prestasi & Konversi Mata Kuliah Mahasiswa
        </p>
      </div>

      <div className="w-full max-w-md">
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Masuk ke Akun</CardTitle>
            <CardDescription>
              Masukkan email dan kata sandi Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} aria-label="Form login">
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@test.com"
                    className="pl-9"
                    disabled={isLoading}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs font-medium text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    disabled={isLoading}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className="text-xs font-medium text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sedang Masuk...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>

              {/* Demo Account Quick Pickers */}
              <div className="w-full pt-4 border-t space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Akun Demo Pengujian:
                  </span>
                  <span className="text-[11px] text-muted-foreground">(pass: password)</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start h-8 px-2.5 bg-rose-50/70 hover:bg-rose-100 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 col-span-2 font-semibold"
                    onClick={() => setDemoAccount('admin@simpresma.unej.ac.id', 'admin123')}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-rose-600 dark:text-rose-400" /> Super Admin (Kelola Role)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start h-8 px-2.5 bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    onClick={() => setDemoAccount('mhs.si@test.com')}
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" /> Mahasiswa SI
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start h-8 px-2.5 bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    onClick={() => setDemoAccount('verif.si@test.com')}
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1.5 text-purple-600 dark:text-purple-400" /> Verifikator SI
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start h-8 px-2.5 bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    onClick={() => setDemoAccount('tendik@test.com')}
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" /> Tendik
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start h-8 px-2.5 bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    onClick={() => setDemoAccount('wadek@test.com')}
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1.5 text-rose-600 dark:text-rose-400" /> Wadek
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setDemoAccount('multi@test.com')}
                >
                  Multi-Role (Verifikator + Tendik)
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Subtle Version Footer */}
        <div className="text-center mt-6">
          <VersionBadge />
        </div>
      </div>
    </main>
  );
}
