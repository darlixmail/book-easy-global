import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Calendar, Package, Clock, LogOut, Settings } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(*)')
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const upcomingBookings = bookings?.filter(
    (booking) => new Date(`${booking.booking_date}T${booking.booking_time}`) >= new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">{t('admin.dashboard')}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card
            className="cursor-pointer transition-all hover:shadow-medium"
            onClick={() => navigate('/admin/services')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('admin.services')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your services and pricing
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:shadow-medium"
            onClick={() => navigate('/admin/schedule')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('admin.schedule')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set your working hours
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:shadow-medium"
            onClick={() => navigate('/admin/profile')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('admin.profile')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update business information
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('admin.bookings')}
            </CardTitle>
            <CardDescription>Upcoming appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings && upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{booking.client_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.services?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.client_phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.booking_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No upcoming bookings
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
