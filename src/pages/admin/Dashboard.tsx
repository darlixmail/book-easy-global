import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Package, Clock, User, Users } from 'lucide-react';
import { demoBookings, demoEmployees, demoBusiness, DemoBooking } from '@/data/demoData';
import RevenueStatisticsCard from '@/components/admin/RevenueStatisticsCard';
import BookingsView from '@/components/admin/BookingsView';
import WeeklyBookingsView from '@/components/admin/WeeklyBookingsView';
import ServicesOverview from '@/components/admin/ServicesOverview';
import CalendarView from '@/components/admin/CalendarView';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';

  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      if (isDemoMode) return demoBookings;
      const { data, error } = await supabase.from('bookings').select('*, services(*)').order('booking_date', { ascending: true }).order('booking_time', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    if (isDemoMode) localStorage.removeItem('demo_mode');
    else await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });

  const todayBookings = (bookings as DemoBooking[] || []).filter(b => b.booking_date === todayStr);
  const weekBookings = (bookings as DemoBooking[] || []).filter(b => {
    const d = new Date(b.booking_date);
    return d >= weekStart && d <= weekEnd;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{isDemoMode ? demoBusiness.name : t('admin.dashboard')}</h1>
            {isDemoMode && <p className="text-sm text-muted-foreground">Demo Mode</p>}
          </div>
          <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />{t('admin.logout')}</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {isDemoMode && (
          <>
            {/* Quick Navigation Cards - Revenue Stats is now clickable like the others */}
            <div className="grid gap-6 md:grid-cols-4">
              <RevenueStatisticsCard bookings={bookings as DemoBooking[] || []} />
              
              <Card className="cursor-pointer transition-all hover:shadow-medium" onClick={() => navigate('/admin/services')}>
                <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />{t('admin.services')}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Manage your services and pricing</p></CardContent>
              </Card>
              <Card className="cursor-pointer transition-all hover:shadow-medium" onClick={() => navigate('/admin/schedule')}>
                <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />{t('admin.schedule')}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Set your working hours</p></CardContent>
              </Card>
              <Card className="cursor-pointer transition-all hover:shadow-medium" onClick={() => navigate('/admin/profile')}>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />{t('admin.profile')}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Update business information</p></CardContent>
              </Card>
            </div>
            
            {/* Today's Bookings */}
            <BookingsView bookings={todayBookings} title="Today's Bookings" showAllLink />
            
            {/* This Week's Bookings - Now with calendar view */}
            <WeeklyBookingsView bookings={bookings as DemoBooking[] || []} />

            <div className="grid gap-6 lg:grid-cols-2">
              <ServicesOverview bookings={bookings as DemoBooking[] || []} todayBookings={todayBookings} weekBookings={weekBookings} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Staff Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoEmployees.map(emp => {
                      const empTodayBookings = todayBookings.filter(b => b.employee_id === emp.id);
                      return (
                        <div key={emp.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{emp.name}</p>
                              <p className="text-sm text-muted-foreground">{emp.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{empTodayBookings.length}</p>
                            <p className="text-xs text-muted-foreground">today</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <CalendarView bookings={bookings as DemoBooking[] || []} />
          </>
        )}

        {!isDemoMode && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="cursor-pointer transition-all hover:shadow-medium" onClick={() => navigate('/admin/services')}>
              <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />{t('admin.services')}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Manage your services and pricing</p></CardContent>
            </Card>
            <Card className="cursor-pointer transition-all hover:shadow-medium" onClick={() => navigate('/admin/schedule')}>
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />{t('admin.schedule')}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Set your working hours</p></CardContent>
            </Card>
            <Card className="cursor-pointer transition-all hover:shadow-medium" onClick={() => navigate('/admin/profile')}>
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />{t('admin.profile')}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Update business information</p></CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
