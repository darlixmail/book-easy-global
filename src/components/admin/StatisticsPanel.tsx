import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, XCircle, Calendar } from 'lucide-react';
import { DemoBooking, demoEmployees, demoServices, calculateRevenue, calculatePrepaidRevenue, getServiceById } from '@/data/demoData';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface StatisticsPanelProps {
  bookings: DemoBooking[];
}

type DateFilter = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'all';

export default function StatisticsPanel({ bookings }: StatisticsPanelProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date filter
    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(b => b.booking_date === format(today, 'yyyy-MM-dd'));
        break;
      case 'yesterday':
        filtered = filtered.filter(b => b.booking_date === format(subDays(today, 1), 'yyyy-MM-dd'));
        break;
      case 'this_week':
        const weekStart = startOfWeek(today, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
        filtered = filtered.filter(b => {
          const date = new Date(b.booking_date);
          return date >= weekStart && date <= weekEnd;
        });
        break;
      case 'this_month':
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        filtered = filtered.filter(b => {
          const date = new Date(b.booking_date);
          return date >= monthStart && date <= monthEnd;
        });
        break;
    }

    // Staff filter
    if (staffFilter !== 'all') {
      filtered = filtered.filter(b => b.employee_id === staffFilter);
    }

    // Service filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(b => b.service_id === serviceFilter);
    }

    return filtered;
  }, [bookings, dateFilter, staffFilter, serviceFilter]);

  const stats = useMemo(() => {
    const completedBookings = filteredBookings.filter(b => b.status === 'completed');
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');

    return {
      expectedRevenue: calculateRevenue(pendingBookings) + calculateRevenue(completedBookings),
      receivedRevenue: calculateRevenue(completedBookings),
      prepaidRevenue: calculatePrepaidRevenue(filteredBookings),
      cancellations: cancelledBookings,
      totalBookings: filteredBookings.length,
    };
  }, [filteredBookings]);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Statistics
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={staffFilter} onValueChange={setStaffFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {demoEmployees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {demoServices.map(srv => (
                  <SelectItem key={srv.id} value={srv.id}>{srv.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Expected Revenue
            </div>
            <p className="text-2xl font-bold text-primary">₪{stats.expectedRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Received Revenue
            </div>
            <p className="text-2xl font-bold text-green-600">₪{stats.receivedRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Prepaid Amount
            </div>
            <p className="text-2xl font-bold text-blue-600">₪{stats.prepaidRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <XCircle className="h-4 w-4" />
              Cancellations
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.cancellations.length}</p>
          </div>
        </div>

        {stats.cancellations.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Recent Cancellations
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.cancellations.slice(0, 5).map(booking => {
                const service = getServiceById(booking.service_id);
                const employee = demoEmployees.find(e => e.id === booking.employee_id);
                return (
                  <div key={booking.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3 text-sm">
                    <div>
                      <span className="font-medium">{booking.client_name}</span>
                      <span className="text-muted-foreground"> - {service?.name}</span>
                      {employee && <span className="text-muted-foreground"> with {employee.name}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(booking.booking_date), 'MMM d')} {booking.booking_time}
                      </Badge>
                      {booking.cancellation_reason && (
                        <Badge variant="secondary" className="text-xs">
                          {booking.cancellation_reason}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
