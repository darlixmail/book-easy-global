import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const { data: business } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (business) {
      setBusinessName(business.name || '');
      setContactEmail(business.contact_email || '');
      setContactPhone(business.contact_phone || '');
      setAddress(business.address || '');
      setDescription(business.description || '');
    }
  }, [business]);

  const upsertMutation = useMutation({
    mutationFn: async (businessData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const payload = {
        ...businessData,
        user_id: user.id,
      };

      if (business?.id) {
        const { error } = await supabase
          .from('businesses')
          .update(payload)
          .eq('id', business.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('businesses').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast.success('Business profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update business profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    upsertMutation.mutate({
      name: businessName,
      contact_email: contactEmail || null,
      contact_phone: contactPhone || null,
      address: address || null,
      description: description || null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('admin.dashboard')}
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">{t('admin.profile')}</h1>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? t('common.loading') : t('common.save')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
