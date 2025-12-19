import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, XCircle, Calendar, Clock } from 'lucide-react';
import { DemoBooking, demoEmployees, demoServices, calculateRevenue, calculatePrepaidRevenue, getServiceById } from '@/data/demoData';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO } from 'date-fns';

interface RevenueStatisticsCardProps {
  bookings: DemoBooking[];
}

type DateFilterType = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom' | 'month' | 'year';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function RevenueStatisticsCard({ bookings }: RevenueStatisticsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth()));
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2].map(String);
  }, []);

  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilterType) {
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
      case 'custom':
        if (customStartDate && customEndDate) {
          const start = parseISO(customStartDate);
          const end = parseISO(customEndDate);
          filtered = filtered.filter(b => {
            const date = new Date(b.booking_date);
            return date >= start && date <= end;
          });
        }
        break;
      case 'month':
        const year = parseInt(selectedYear);
        const month = parseInt(selectedMonth);
        const mStart = new Date(year, month, 1);
        const mEnd = endOfMonth(mStart);
        filtered = filtered.filter(b => {
          const date = new Date(b.booking_date);
          return date >= mStart && date <= mEnd;
        });
        break;
      case 'year':
        const yStart = startOfYear(new Date(parseInt(selectedYear), 0, 1));
        const yEnd = endOfYear(yStart);
        filtered = filtered.filter(b => {
          const date = new Date(b.booking_date);
          return date >= yStart && date <= yEnd;
        });
        break;
    }

    if (staffFilter !== 'all') {
      filtered = filtered.filter(b => b.employee_id === staffFilter);
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(b => b.service_id === serviceFilter);
    }

    return filtered;
  }, [bookings, dateFilterType, customStartDate, customEndDate, selectedMonth, selectedYear, staffFilter, serviceFilter]);

  const stats = useMemo(() => {
    const completedBookings = filteredBookings.filter(b => b.status === 'completed');
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');

    // Prepaid revenue counts as pending until service is completed
    const prepaidPending = filteredBookings.filter(b => b.is_prepaid && b.status !== 'completed' && b.status !== 'cancelled');
    const prepaidPendingAmount = calculatePrepaidRevenue(prepaidPending);

    // Received = completed bookings revenue
    const receivedRevenue = calculateRevenue(completedBookings);

    // Pending = pending/confirmed bookings that aren't completed yet (includes prepaid as pending)
    const pendingRevenue = calculateRevenue(pendingBookings);

    // Expected = received + pending (everything not cancelled)
    const expectedRevenue = receivedRevenue + pendingRevenue;

    return {
      expectedRevenue,
      receivedRevenue,
      pendingRevenue,
      prepaidPendingAmount,
      cancellations: cancelledBookings,
      totalBookings: filteredBookings.length,
    };
  }, [filteredBookings]);

  // Quick summary for the card preview
  const todayStats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayBookings = bookings.filter(b => b.booking_date === today);
    const completed = todayBookings.filter(b => b.status === 'completed');
    const pending = todayBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
    return {
      expected: calculateRevenue(completed) + calculateRevenue(pending),
      received: calculateRevenue(completed),
    };
  }, [bookings]);

  return (
    <>
      <Card 
        className="cursor-pointer transition-all hover:shadow-medium"
        onClick={() => setIsOpen(true)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Expected</p>
              <p className="text-xl font-bold text-primary">₪{todayStats.expected.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Received</p>
              <p className="text-xl font-bold text-green-600">₪{todayStats.received.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Statistics
            </DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="space-y-1">
              <Label className="text-xs">Period</Label>
              <Select value={dateFilterType} onValueChange={(v) => setDateFilterType(v as DateFilterType)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="month">Select Month</SelectItem>
                  <SelectItem value="year">Select Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateFilterType === 'month' && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs">Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((month, idx) => (
                        <SelectItem key={idx} value={String(idx)}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {dateFilterType === 'year' && (
              <div className="space-y-1">
                <Label className="text-xs">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {dateFilterType === 'custom' && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs">From</Label>
                  <Input 
                    type="date" 
                    value={customStartDate} 
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-[140px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To</Label>
                  <Input 
                    type="date" 
                    value={customEndDate} 
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-[140px]"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label className="text-xs">Staff</Label>
              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {demoEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Service</Label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[140px]">
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

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                Expected Revenue
              </div>
              <p className="text-2xl font-bold text-primary">₪{stats.expectedRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Received + Pending</p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                Received Revenue
              </div>
              <p className="text-2xl font-bold text-green-600">₪{stats.receivedRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Completed services</p>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Pending Revenue
              </div>
              <p className="text-2xl font-bold text-amber-600">₪{stats.pendingRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Includes ₪{stats.prepaidPendingAmount.toLocaleString()} prepaid</p>
            </div>
            <div className="bg-red-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <XCircle className="h-4 w-4" />
                Cancellations
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.cancellations.length}</p>
            </div>
          </div>

          {/* Cancellations Section */}
          {stats.cancellations.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                Cancellations
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stats.cancellations.map(booking => {
                  const service = getServiceById(booking.service_id);
                  const employee = demoEmployees.find(e => e.id === booking.employee_id);
                  return (
                    <div key={booking.id} className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">
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
                          <Badge variant="destructive" className="text-xs bg-red-600 text-white">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
