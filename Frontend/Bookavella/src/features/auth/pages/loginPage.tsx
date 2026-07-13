import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema, LoginFormValues } from '../lib/schemas';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '@/constants';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../@/components/ui/form';
import { Input } from '../../../../@/components/ui/input';
import { Button } from '../../../../@/components/ui/button';
import { Separator } from '../../../../@/components/ui/separator';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

 return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-[420px] bg-surface border-border shadow-lg rounded-md">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="font-heading text-2xl font-bold tracking-wider text-accent">
            BOOKAVELLA
          </div>
          <CardTitle className="text-xl font-heading font-medium text-text-primary">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs text-text-secondary">
            Enter your credentials to access your sanctuary
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* E-mail Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-text-secondary">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="bg-background border-border text-text-primary focus:border-accent text-sm h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-medium text-text-secondary">Password</FormLabel>
                      <Link
                        to="/auth/reset-password"
                        className="text-xs text-accent hover:text-accent-hover transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="bg-background border-border text-text-primary focus:border-accent pr-10 text-sm h-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending} // ◄ UX IMPROVEMENT: Evita requisições redundantes
                className="w-full bg-accent text-background hover:bg-accent-hover font-medium h-10 rounded-sm mt-2 transition-colors flex items-center justify-center gap-2"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authenticating session...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </form>
          </Form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-text-secondary text-[10px] tracking-widest">or join us</span>
              </div>
            </div>

            <div className="text-center space-y-2 text-xs text-text-secondary">
              <p>
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER} className="text-accent hover:text-accent-hover font-medium transition-colors">
                  Register
                </Link>
              </p>
              <p>
                Are you a property owner?{' '}
                <Link to="/auth/register-owner" className="text-accent hover:text-accent-hover font-medium transition-colors">
                  Register as Owner
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}