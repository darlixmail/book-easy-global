import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Users, User, TrendingDown } from 'lucide-react';
import { DemoBooking, demoServices, demoEmployees, getServiceById } from '@/data/demoData';
import { format, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, subDays } from 'date-fns';

interface ServicesStaffOverviewPageProps {
  bookings: DemoBooking[];
}

export default function ServicesStaffOverviewPage({ bookings }: ServicesStaffOverviewPageProps) {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
  
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
  const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
  
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const lastMonthStart = startOfMonth(subMonths(today, 1));
  const lastMonthEnd = endOfMonth(subMonths(today, 1));

  // Filter bookings by periods
  const todayBookings = bookings.filter(b => b.booking_date === todayStr);
  const yesterdayBookings = bookings.filter(b => b.booking_date === yesterdayStr);
  
  const weekBookings = bookings.filter(b => {
    const d = new Date(b.booking_date);
    return d >= weekStart && d <= weekEnd;
  });
  
  const lastWeekBookings = bookings.filter(b => {
    const d = new Date(b.booking_date);
    return d >= lastWeekStart && d <= lastWeekEnd;
  });
  
  const monthBookings = bookings.filter(b => {
    const d = new Date(b.booking_date);
    return d >= monthStart && d <= monthEnd;
  });
  
  const lastMonthBookings = bookings.filter(b => {
    const d = new Date(b.booking_date);
    return d >= lastMonthStart && d <= lastMonthEnd;
  });

  // Check if value dropped 20% below previous
  const isDown20Percent = (current: number, previous: number) => {
    if (previous === 0) return false;
    return current < previous * 0.8;
  };

  // Service stats with comparison
  const serviceStats = useMemo(() => {
    return demoServices.map(service => {
      const todayCount = todayBookings.filter(b => b.service_id === service.id && b.status !== 'cancelled').length;
      const yesterdayCount = yesterdayBookings.filter(b => b.service_id === service.id && b.status !== 'cancelled').length;
      
      const weekCount = weekBookings.filter(b => b.service_id === service.id && b.status !== 'cancelled').length;
      const lastWeekCount = lastWeekBookings.filter(b => b.service_id === service.id && b.status !== 'cancelled').length;
      
      const monthCount = monthBookings.filter(b => b.service_id === service.id && b.status !== 'cancelled').length;
      const lastMonthCount = lastMonthBookings.filter(b => b.service_id === service.id && b.status !== 'cancelled').length;
      
      const todayRevenue = todayCount * service.price;
      const yesterdayRevenue = yesterdayCount * service.price;
      
      const weekRevenue = weekCount * service.price;
      const lastWeekRevenue = lastWeekCount * service.price;
      
      const monthRevenue = monthCount * service.price;
      const lastMonthRevenue = lastMonthCount * service.price;

      return {
        ...service,
        todayCount, yesterdayCount,
        weekCount, lastWeekCount,
        monthCount, lastMonthCount,
        todayRevenue, yesterdayRevenue,
        weekRevenue, lastWeekRevenue,
        monthRevenue, lastMonthRevenue,
        todayDown: isDown20Percent(todayCount, yesterdayCount),
        weekDown: isDown20Percent(weekCount, lastWeekCount),
        monthDown: isDown20Percent(monthCount, lastMonthCount),
        todayRevenueDown: isDown20Percent(todayRevenue, yesterdayRevenue),
        weekRevenueDown: isDown20Percent(weekRevenue, lastWeekRevenue),
        monthRevenueDown: isDown20Percent(monthRevenue, lastMonthRevenue),
      };
    }).sort((a, b) => b.weekCount - a.weekCount);
  }, [todayBookings, yesterdayBookings, weekBookings, lastWeekBookings, monthBookings, lastMonthBookings]);

  // Staff stats with comparison
  const staffStats = useMemo(() => {
    return demoEmployees.map(employee => {
      const todayCount = todayBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled').length;
      const yesterdayCount = yesterdayBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled').length;
      
      const weekCount = weekBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled').length;
      const lastWeekCount = lastWeekBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled').length;
      
      const monthCount = monthBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled').length;
      const lastMonthCount = lastMonthBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled').length;
      
      const todayRevenue = todayBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled')
        .reduce((sum, b) => sum + (getServiceById(b.service_id)?.price || 0), 0);
      const yesterdayRevenue = yesterdayBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled')
        .reduce((sum, b) => sum + (getServiceById(b.service_id)?.price || 0), 0);
      
      const weekRevenue = weekBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled')
        .reduce((sum, b) => sum + (getServiceById(b.service_id)?.price || 0), 0);
      const lastWeekRevenue = lastWeekBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled')
        .reduce((sum, b) => sum + (getServiceById(b.service_id)?.price || 0), 0);
      
      const monthRevenue = monthBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled')
        .reduce((sum, b) => sum + (getServiceById(b.service_id)?.price || 0), 0);
      const lastMonthRevenue = lastMonthBookings.filter(b => b.employee_id === employee.id && b.status !== 'cancelled')
        .reduce((sum, b) => sum + (getServiceById(b.service_id)?.price || 0), 0);

      return {
        ...employee,
        todayCount, yesterdayCount,
        weekCount, lastWeekCount,
        monthCount, lastMonthCount,
        todayRevenue, yesterdayRevenue,
        weekRevenue, lastWeekRevenue,
        monthRevenue, lastMonthRevenue,
        todayDown: isDown20Percent(todayCount, yesterdayCount),
        weekDown: isDown20Percent(weekCount, lastWeekCount),
        monthDown: isDown20Percent(monthCount, lastMonthCount),
        todayRevenueDown: isDown20Percent(todayRevenue, yesterdayRevenue),
        weekRevenueDown: isDown20Percent(weekRevenue, lastWeekRevenue),
        monthRevenueDown: isDown20Percent(monthRevenue, lastMonthRevenue),
      };
    }).sort((a, b) => b.weekCount - a.weekCount);
  }, [todayBookings, yesterdayBookings, weekBookings, lastWeekBookings, monthBookings, lastMonthBookings]);

  // Service totals
  const serviceTotals = useMemo(() => ({
    todayBookings: todayBookings.filter(b => b.status !== 'cancelled').length,
    yesterdayBookings: yesterdayBookings.filter(b => b.status !== 'cancelled').length,
    weekBookings: weekBookings.filter(b => b.status !== 'cancelled').length,
    lastWeekBookings: lastWeekBookings.filter(b => b.status !== 'cancelled').length,
    monthBookings: monthBookings.filter(b => b.status !== 'cancelled').length,
    lastMonthBookings: lastMonthBookings.filter(b => b.status !== 'cancelled').length,
    todayRevenue: serviceStats.reduce((sum, s) => sum + s.todayRevenue, 0),
    yesterdayRevenue: serviceStats.reduce((sum, s) => sum + s.yesterdayRevenue, 0),
    weekRevenue: serviceStats.reduce((sum, s) => sum + s.weekRevenue, 0),
    lastWeekRevenue: serviceStats.reduce((sum, s) => sum + s.lastWeekRevenue, 0),
    monthRevenue: serviceStats.reduce((sum, s) => sum + s.monthRevenue, 0),
    lastMonthRevenue: serviceStats.reduce((sum, s) => sum + s.lastMonthRevenue, 0),
  }), [serviceStats, todayBookings, yesterdayBookings, weekBookings, lastWeekBookings, monthBookings, lastMonthBookings]);

  // Group services by category
  const groupedServices = useMemo(() => {
    const groups: Record<string, typeof serviceStats> = {};
    serviceStats.forEach(service => {
      const category = service.category || 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(service);
    });
    return groups;
  }, [serviceStats]);

  const StatValue = ({ value, isDown, prefix = '' }: { value: number; isDown: boolean; prefix?: string }) => (
    <span className={`font-semibold ${isDown ? 'text-destructive' : 'text-green-600'}`}>
      {isDown && <TrendingDown className="inline h-3 w-3 mr-0.5" />}
      {prefix}{value.toLocaleString()}
    </span>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Services Overview
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Services Overview
                  <Badge variant="secondary">{demoServices.length} services</Badge>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Summary Row */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today's Bookings</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.todayBookings, serviceTotals.yesterdayBookings) ? 'text-destructive' : ''}`}>
                    {serviceTotals.todayBookings}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Week's Bookings</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.weekBookings, serviceTotals.lastWeekBookings) ? 'text-destructive' : ''}`}>
                    {serviceTotals.weekBookings}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Month's Bookings</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.monthBookings, serviceTotals.lastMonthBookings) ? 'text-destructive' : ''}`}>
                    {serviceTotals.monthBookings}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.todayRevenue, serviceTotals.yesterdayRevenue) ? 'text-destructive' : 'text-green-600'}`}>
                    ₪{serviceTotals.todayRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Week's Revenue</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.weekRevenue, serviceTotals.lastWeekRevenue) ? 'text-destructive' : 'text-green-600'}`}>
                    ₪{serviceTotals.weekRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Month's Revenue</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.monthRevenue, serviceTotals.lastMonthRevenue) ? 'text-destructive' : 'text-green-600'}`}>
                    ₪{serviceTotals.monthRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Services by Category */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {Object.entries(groupedServices).map(([category, services]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">{category}</h4>
                    <div className="space-y-2">
                      {services.map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">₪{service.price} • {service.duration_minutes} min</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <p className={service.todayDown ? 'font-semibold text-destructive' : 'font-semibold'}>{service.todayCount}</p>
                              <p className="text-xs text-muted-foreground">Today</p>
                            </div>
                            <div className="text-center">
                              <p className={service.weekDown ? 'font-semibold text-destructive' : 'font-semibold'}>{service.weekCount}</p>
                              <p className="text-xs text-muted-foreground">Week</p>
                            </div>
                            <div className="text-center">
                              <p className={service.monthDown ? 'font-semibold text-destructive' : 'font-semibold'}>{service.monthCount}</p>
                              <p className="text-xs text-muted-foreground">Month</p>
                            </div>
                            <div className="text-center min-w-[80px]">
                              <StatValue value={service.weekRevenue} isDown={service.weekRevenueDown} prefix="₪" />
                              <p className="text-xs text-muted-foreground">Week Rev</p>
                            </div>
                            <div className="text-center min-w-[80px]">
                              <StatValue value={service.monthRevenue} isDown={service.monthRevenueDown} prefix="₪" />
                              <p className="text-xs text-muted-foreground">Month Rev</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Overview
                <Badge variant="secondary">{demoEmployees.length} staff</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Staff Summary */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today's Bookings</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.todayBookings, serviceTotals.yesterdayBookings) ? 'text-destructive' : ''}`}>
                    {serviceTotals.todayBookings}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Week's Bookings</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.weekBookings, serviceTotals.lastWeekBookings) ? 'text-destructive' : ''}`}>
                    {serviceTotals.weekBookings}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Month's Bookings</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.monthBookings, serviceTotals.lastMonthBookings) ? 'text-destructive' : ''}`}>
                    {serviceTotals.monthBookings}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.todayRevenue, serviceTotals.yesterdayRevenue) ? 'text-destructive' : 'text-green-600'}`}>
                    ₪{serviceTotals.todayRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Week's Revenue</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.weekRevenue, serviceTotals.lastWeekRevenue) ? 'text-destructive' : 'text-green-600'}`}>
                    ₪{serviceTotals.weekRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Month's Revenue</p>
                  <p className={`text-2xl font-bold ${isDown20Percent(serviceTotals.monthRevenue, serviceTotals.lastMonthRevenue) ? 'text-destructive' : 'text-green-600'}`}>
                    ₪{serviceTotals.monthRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Staff List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {staffStats.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-sm text-muted-foreground">{emp.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className={emp.todayDown ? 'font-semibold text-destructive' : 'font-semibold'}>{emp.todayCount}</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                      <div className="text-center">
                        <p className={emp.weekDown ? 'font-semibold text-destructive' : 'font-semibold'}>{emp.weekCount}</p>
                        <p className="text-xs text-muted-foreground">Week</p>
                      </div>
                      <div className="text-center">
                        <p className={emp.monthDown ? 'font-semibold text-destructive' : 'font-semibold'}>{emp.monthCount}</p>
                        <p className="text-xs text-muted-foreground">Month</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <StatValue value={emp.todayRevenue} isDown={emp.todayRevenueDown} prefix="₪" />
                        <p className="text-xs text-muted-foreground">Today Rev</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <StatValue value={emp.weekRevenue} isDown={emp.weekRevenueDown} prefix="₪" />
                        <p className="text-xs text-muted-foreground">Week Rev</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <StatValue value={emp.monthRevenue} isDown={emp.monthRevenueDown} prefix="₪" />
                        <p className="text-xs text-muted-foreground">Month Rev</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}