import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Calendar, Clock } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            BookEasy
          </h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/login')}>
              {t('nav.admin')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t('hero.title')}
          </h2>
          <p className="mb-8 text-lg md:text-xl opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {t('hero.subtitle')}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="shadow-glow animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
            onClick={() => navigate('/book')}
          >
            {t('hero.cta')}
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-8 text-center text-3xl font-bold">{t('services.title')}</h3>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="group overflow-hidden border-2 transition-all hover:border-primary hover:shadow-medium"
                >
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    {service.description && (
                      <CardDescription>{service.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{t('services.duration', { minutes: service.duration_minutes })}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${service.price}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/book/${service.id}`)}
                    >
                      {t('services.select')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
