import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Clock, ArrowLeft, Scissors, Sparkles } from 'lucide-react';
import { demoServices, demoBusiness } from '@/data/demoData';
import { Badge } from '@/components/ui/badge';

export default function ServiceSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: dbServices, isLoading } = useQuery({
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

  // Use demo data if no real services exist
  const isDemo = !dbServices || dbServices.length === 0;
  const services = isDemo ? demoServices : dbServices;

  // Group services by category for demo mode
  const groupedServices = isDemo 
    ? demoServices.reduce((acc, service) => {
        const category = (service as any).category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
      }, {} as Record<string, typeof demoServices>)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          {isDemo && (
            <Badge variant="secondary" className="mb-4 gap-1">
              <Sparkles className="h-3 w-3" />
              Demo Mode - {demoBusiness.name}
            </Badge>
          )}
          <h1 className="text-3xl font-bold mb-2">{t('booking.selectService')}</h1>
          <p className="text-muted-foreground">{t('booking.chooseServiceDescription')}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : services && services.length > 0 ? (
          isDemo && groupedServices ? (
            <div className="max-w-5xl mx-auto space-y-8">
              {Object.entries(groupedServices).map(([category, categoryServices]) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="h-1 w-8 bg-primary rounded-full" />
                    {category}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryServices.map((service) => (
                      <Card
                        key={service.id}
                        className="group cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-medium hover:scale-[1.02]"
                        onClick={() => navigate(`/book/${service.id}?demo=true`)}
                      >
                        <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Scissors className="h-12 w-12 text-primary/30" />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          {service.description && (
                            <CardDescription className="text-sm line-clamp-2">
                              {service.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{service.duration_minutes} min</span>
                            </div>
                            <div className="text-xl font-bold text-primary">
                              ₪{service.price}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="group cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-medium hover:scale-[1.02]"
                  onClick={() => navigate(`/book/${service.id}`)}
                >
                  {(service as any).image_url ? (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img 
                        src={(service as any).image_url} 
                        alt={service.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Scissors className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    {service.description && (
                      <CardDescription className="text-sm line-clamp-2">
                        {service.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        ₪{service.price}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
