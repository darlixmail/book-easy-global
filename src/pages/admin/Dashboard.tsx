import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Calendar, Package, Clock, LogOut, Settings, Users, User } from 'lucide-react';
import { format } from 'date-fns';
import { demoBusiness, demoBookings, demoEmployees, demoServices } from '@/data/demoData';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';

  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      if (isDemoMode) {
        return demoBookings;
      }
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
    if (isDemoMode) {
      localStorage.removeItem('demo_mode');
    } else {
      await supabase.auth.signOut();
    }
    navigate('/admin/login');
  };

  const upcomingBookings = bookings?.filter(
    (booking) => new Date(`${booking.booking_date}T${booking.booking_time}`) >= new Date()
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings?.filter(b => b.booking_date === todayStr) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">
              {isDemoMode ? demoBusiness.name : t('admin.dashboard')}
            </h1>
            {isDemoMode && (
              <Badge variant="secondary" className="text-xs">Demo Mode</Badge>
            )}
          </div>
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
        {/* Stats Overview */}
        {isDemoMode && (
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Bookings</p>
                    <p className="text-2xl font-bold">{todayBookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                    <p className="text-2xl font-bold">{demoEmployees.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Services</p>
                    <p className="text-2xl font-bold">{demoServices.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold">{bookings?.length || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

        {/* Staff Overview - Demo Only */}
        {isDemoMode && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Members
              </CardTitle>
              <CardDescription>Your team of professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {demoEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                {upcomingBookings.slice(0, 10).map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{booking.client_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {isDemoMode ? booking.service?.name : booking.services?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.client_phone}
                      </p>
                      {isDemoMode && booking.employee && (
                        <p className="text-xs text-primary">
                          with {booking.employee.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.booking_time}
                      </p>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {booking.status}
                      </Badge>
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
