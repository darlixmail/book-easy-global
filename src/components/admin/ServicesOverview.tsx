import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign, Calendar } from 'lucide-react';
import { DemoBooking, demoServices, getServiceById } from '@/data/demoData';

interface ServicesOverviewProps {
  bookings: DemoBooking[];
  todayBookings: DemoBooking[];
  weekBookings: DemoBooking[];
}

export default function ServicesOverview({ bookings, todayBookings, weekBookings }: ServicesOverviewProps) {
  const serviceStats = useMemo(() => {
    const stats = demoServices.map(service => {
      const todayCount = todayBookings.filter(b => b.service_id === service.id && b.status !== 'cancelled').length;
      const weekCount = weekBookings.filter(b => b.service_id === service.id && b.status !== 'cancelled').length;
      const todayRevenue = todayCount * service.price;
      const weekRevenue = weekCount * service.price;

      return {
        ...service,
        todayCount,
        weekCount,
        todayRevenue,
        weekRevenue,
      };
    });

    return stats.sort((a, b) => b.weekCount - a.weekCount);
  }, [todayBookings, weekBookings]);

  const totals = useMemo(() => {
    return {
      todayBookings: todayBookings.filter(b => b.status !== 'cancelled').length,
      weekBookings: weekBookings.filter(b => b.status !== 'cancelled').length,
      todayRevenue: serviceStats.reduce((sum, s) => sum + s.todayRevenue, 0),
      weekRevenue: serviceStats.reduce((sum, s) => sum + s.weekRevenue, 0),
    };
  }, [serviceStats, todayBookings, weekBookings]);

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

  return (
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Today's Bookings</p>
            <p className="text-2xl font-bold">{totals.todayBookings}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Week's Bookings</p>
            <p className="text-2xl font-bold">{totals.weekBookings}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Today's Revenue</p>
            <p className="text-2xl font-bold text-green-600">₪{totals.todayRevenue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Week's Revenue</p>
            <p className="text-2xl font-bold text-green-600">₪{totals.weekRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Services by Category */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
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
                        <p className="font-semibold">{service.todayCount}</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{service.weekCount}</p>
                        <p className="text-xs text-muted-foreground">Week</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="font-semibold text-green-600">₪{service.weekRevenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
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
  );
}
