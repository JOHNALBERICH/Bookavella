import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { registerSchema, RegisterFormValues } from '@/features/auth/lib/schemas';
import { useRegisterOwner } from '@/features/auth/hooks/useRegisterOwner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../@/components/ui/form';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';

export default function RegisterOwnerPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const registerOwnerMutation = useRegisterOwner();

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

  const onSubmit = (data: RegisterFormValues) => {
    // Sincroniza dados com o request estruturado do proprietário no backend
    console.log("SUBMIT CLICKED");
    console.log(data);
    registerOwnerMutation.mutate({
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      nationality: data.nationality,
      password: data.password,
      confirmpassword: data.confirmpassword,
    });
  };
  useEffect(() => {
  console.log(form.formState.errors);
}, [form.formState.errors]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-[420px] bg-surface border-border shadow-lg rounded-md">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="font-heading text-2xl font-bold tracking-wider text-accent">
            BOOKAVELLA
          </div>
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold font-body">Partner Registration</p>
          <CardTitle className="text-xl font-heading font-medium text-text-primary">
            Host with Bookavella
          </CardTitle>
          <CardDescription className="text-xs text-text-secondary">
            Register your property portfolio in our editorial circle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Banner de Verificação do Proprietário */}
          <div className="p-4 rounded-sm bg-warning/10 border border-warning/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <p className="text-[11px] text-text-secondary leading-relaxed font-body">
              Property Owner accounts may require verification before you can list properties.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit,(errors) => console.log(errors))} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Partner/Company Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe Hotels"
                        className="bg-background text-sm h-10 border-border focus:border-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Corporate Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="host@domain.com"
                        className="bg-background text-sm h-10 border-border focus:border-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-error mt-1" />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Contact Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+55 11 99999-9999"
                        className="bg-background text-sm h-10 border-border focus:border-accent"
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
                    <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          className="bg-background pr-10 text-sm h-10 border-border focus:border-accent"
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
                          className="bg-background pr-10 text-sm h-10 border-border focus:border-accent"
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
                disabled={registerOwnerMutation.isPending}
                className="w-full bg-accent text-background hover:bg-accent-hover font-semibold h-10 rounded-sm mt-2 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {registerOwnerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing Up...</span>
                  </>
                ) : (
                  'Register Partner Portfolio'
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