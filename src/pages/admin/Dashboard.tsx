import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Package, Clock, User, BarChart3 } from 'lucide-react';
import { demoBookings, demoBusiness, DemoBooking } from '@/data/demoData';
import RevenueStatisticsCard from '@/components/admin/RevenueStatisticsCard';
import BookingsView from '@/components/admin/BookingsView';
import WeeklyBookingsView from '@/components/admin/WeeklyBookingsView';
import CalendarView from '@/components/admin/CalendarView';
import ServicesStaffOverviewPage from '@/components/admin/ServicesStaffOverviewPage';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const [showOverview, setShowOverview] = useState(false);

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
            {/* Top Row: Revenue Stats only */}
            <div className="grid gap-6 md:grid-cols-2">
              <RevenueStatisticsCard bookings={bookings as DemoBooking[] || []} />
              
              {/* Services & Staff Overview - Clickable Card (Owner Only) */}
              <Card className="cursor-pointer transition-all hover:shadow-medium" onClick={() => setShowOverview(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Services & Staff Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View detailed performance statistics for services and staff members</p>
                  <p className="text-xs text-muted-foreground mt-2 italic">Owner access only</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Today's Bookings */}
            <BookingsView bookings={todayBookings} title="Today's Bookings" showAllLink />
            
            {/* This Week's Bookings - Now with calendar view */}
            <WeeklyBookingsView bookings={bookings as DemoBooking[] || []} />

            {/* All Bookings Calendar */}
            <CalendarView bookings={bookings as DemoBooking[] || []} />

            {/* Bottom Navigation Cards */}
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

      {/* Services & Staff Overview Dialog */}
      <Dialog open={showOverview} onOpenChange={setShowOverview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Services & Staff Overview</DialogTitle>
          </DialogHeader>
          <ServicesStaffOverviewPage bookings={bookings as DemoBooking[] || []} />
        </DialogContent>
      </Dialog>
    </div>
  );
}