import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { registerSchema, RegisterFormValues } from '@/features/auth/lib/schemas';
import { useRegister } from '@/features/auth/hooks/useRegister';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../@/components/ui/form';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const registerMutation = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      phoneNumber: '',
      gender: '',
      nationality: '',
      password: '',
      confirmpassword: '',
    },
  });
  // Debug form state
  console.log('Form errors:', form.formState.errors);
  console.log('Is form valid?', form.formState.isValid);

  const onSubmit = (data: RegisterFormValues) => {
    // ◄ ALINHAMENTO DE SCHEMA: O formulário visual oculta estes campos opcionais, mas os envia
    // vazios para conformidade com o payload da API.
    console.log('Register form submitted:', data);
    registerMutation.mutate({
      
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      confirmpassword: data.confirmpassword,
      gender: data.gender || '',
      nationality: data.nationality || '',
    });
  };
   const onError = (errors: any) => {
    console.log('❌ Validation errors:', errors);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 font-body text-text-primary">
      <Card className="w-full max-w-md bg-surface border-border shadow-lg rounded-md">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="font-heading text-2xl font-bold tracking-wider text-accent">
            BOOKAVELLA
          </div>
          <CardTitle className="text-xl font-heading font-medium text-text-primary">
            Create your account
          </CardTitle>
          <CardDescription className="text-xs text-text-secondary">
            Join our exclusive curation of modern sanctuaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="bg-background border-border text-text-primary focus-visible:ring-accent text-sm h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="bg-background border-border text-text-primary focus-visible:ring-accent text-sm h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+55 11 99999-9999"
                        className="bg-background border-border text-text-primary focus-visible:ring-accent text-sm h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          className="bg-background border-border text-text-primary focus-visible:ring-accent pr-10 text-sm h-10"
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

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repeat password"
                          className="bg-background border-border text-text-primary focus-visible:ring-accent pr-10 text-sm h-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />
              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Gender</FormLabel>
                    <FormControl>
                      <select
                        className="w-full bg-background border-border text-text-primary focus-visible:ring-accent text-sm h-10 rounded-md px-3"
                        {...field}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />

              {/* Nationality */}
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Nationality</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your nationality"
                        className="bg-background border-border text-text-primary focus-visible:ring-accent text-sm h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />
              {/* Submit */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-accent text-background hover:bg-accent-hover font-semibold h-10 rounded-sm mt-2 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing Up...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-xs text-text-secondary pt-2">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-accent hover:text-accent-hover font-semibold transition-colors">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}