import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile';
import { useChangeAvatar } from '@/features/auth/hooks/useChangeAvatar';
import { updateProfileSchema, UpdateProfileFormValues } from '@/features/auth/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../@/components/ui/form';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../@/components/ui/avatar';
import { Loader2, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const changeAvatarMutation = useChangeAvatar();
  
  const [avatarInput, setAvatarInput] = useState<string>('');

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onBlur', // Validações inline disparadas no evento blur do campo
    defaultValues: {
      name: '',
      phoneNumber: '',
      gender: '',
      nationality: '',
    },
  });

  // Sincroniza os dados de sessão do usuário logado no formulário
  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || '',
        phoneNumber: currentUser.phoneNumber || '',
        gender: currentUser.gender || '',
        nationality: currentUser.nationality || '',
      });
      setAvatarInput(currentUser.avatarUrl || '');
    }
  }, [currentUser, form]);

  const onProfileSubmit = (data: UpdateProfileFormValues) => {
    if (!currentUser) {
      toast.error('Session expired. Please log in again.');
      return; }

    // ◄ TS FIX: Injeta os metadados controlados do AuthContext no payload final do UpdateProfileRequest
    updateProfileMutation.mutate({
      userId: currentUser.id,
      avatarUrl: currentUser.avatarUrl || '',
      name: data.name,
      phoneNumber: data.phoneNumber,
      gender: data.gender || '',
      nationality: data.nationality || '',
    });
  };

  const handleAvatarUpdate = () => {
    if (!avatarInput.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }
    changeAvatarMutation.mutate({ avatarUrl: avatarInput.trim() });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-semibold text-text-primary">My Profile</h1>
        <p className="text-sm text-text-secondary">Manage your personal identification, contact details, and avatar image.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: GESTÃO DO AVATAR */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-surface border-border">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-sm font-heading">Profile Image</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              {/* Moldura circular dourada Champagne Gold */}
              <Avatar className="h-24 w-24 border-2 border-accent">
                <AvatarImage src={currentUser?.avatarUrl || ''} alt={currentUser?.name || 'User'} />
                <AvatarFallback className="bg-background text-text-secondary text-xl font-bold uppercase">
                  {currentUser?.name?.substring(0, 2) || 'US'}
                </AvatarFallback>
              </Avatar>

              {/* Caixa de Texto de Entrada de URL */}
              <div className="w-full space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Avatar URL</label>
                  <Input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    className="bg-background text-xs h-9 border-border focus:border-accent"
                  />
                </div>
                <Button
                  onClick={handleAvatarUpdate}
                  disabled={changeAvatarMutation.isPending}
                  variant="outline"
                  className="w-full h-9 text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {changeAvatarMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      <span>Update Avatar</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA: FORMULÁRIO CADASTRAL */}
        <div className="lg:col-span-8">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Personal Details</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                Provide your identification details and verified phone number.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome Completo */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-background text-sm h-10 border-border focus:border-accent" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs text-error mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* Número de Telefone */}
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+55 11 99999-9999" className="bg-background text-sm h-10 border-border focus:border-accent" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs text-error mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Gênero (Menu Seletor) */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Gender</FormLabel>
                          <FormControl>
                            <select
                              className="w-full bg-background border border-border text-sm h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent"
                              {...field}
                            >
                              <option value="">Unspecified</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Non-Binary">Non-Binary</option>
                            </select>
                          </FormControl>
                          <FormMessage className="text-xs text-error mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* Nacionalidade */}
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="Brazilian" className="bg-background text-sm h-10 border-border focus:border-accent" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs text-error mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Ação de Submissão */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="h-10 text-xs px-6 flex items-center gap-1.5 cursor-pointer"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Details</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}