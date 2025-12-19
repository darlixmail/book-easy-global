import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign, UserCheck, UserPlus, Users } from 'lucide-react';
import { DemoBooking, demoEmployees, demoServices, getServiceById, getCustomerById, DemoCustomer } from '@/data/demoData';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import CustomerHistoryModal from './CustomerHistoryModal';

interface CalendarViewProps {
  bookings: DemoBooking[];
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

export default function CalendarView({ bookings }: CalendarViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<DemoCustomer | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredBookings = useMemo(() => {
    if (employeeFilter === 'all') return bookings;
    return bookings.filter(b => b.employee_id === employeeFilter);
  }, [bookings, employeeFilter]);

  const getBookingsForSlot = (date: Date, time: string, employeeId?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredBookings.filter(b => {
      const matches = b.booking_date === dateStr && b.booking_time === time;
      if (employeeId) return matches && b.employee_id === employeeId;
      return matches;
    });
  };

  const getCustomerIcon = (type: string) => {
    switch (type) {
      case 'new': return <UserPlus className="h-3 w-3 text-green-500" />;
      case 'recurring': return <Users className="h-3 w-3 text-blue-500" />;
      case 'regular': return <UserCheck className="h-3 w-3 text-purple-500" />;
      default: return null;
    }
  };

  const handleCustomerClick = (customerId: string) => {
    const customer = getCustomerById(customerId);
    if (customer) setSelectedCustomer(customer);
  };

  const renderBookingCell = (booking: DemoBooking) => {
    const service = getServiceById(booking.service_id);
    return (
      <div 
        key={booking.id}
        className={`text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 ${
          booking.status === 'cancelled' ? 'bg-red-100 line-through' :
          booking.status === 'completed' ? 'bg-green-100' :
          'bg-primary/20'
        }`}
        onClick={() => handleCustomerClick(booking.customer_id)}
      >
        <div className="flex items-center gap-1">
          {getCustomerIcon(booking.customer_type)}
          <span className="truncate font-medium">{booking.client_name}</span>
          {booking.is_prepaid && <DollarSign className="h-3 w-3 text-green-600 ml-auto" />}
        </div>
        <div className="text-muted-foreground truncate">{service?.name}</div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Bookings Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
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
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Week header */}
            <div className="grid grid-cols-8 gap-1 mb-2 min-w-[800px]">
              <div className="text-xs font-medium text-muted-foreground p-2">Time</div>
              {weekDays.map(day => (
                <div 
                  key={day.toISOString()} 
                  className={`text-center p-2 rounded ${
                    isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                  <div className="text-lg font-bold">{format(day, 'd')}</div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="space-y-1 max-h-[500px] overflow-y-auto min-w-[800px]">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 gap-1">
                  <div className="text-xs text-muted-foreground p-2 sticky left-0 bg-background">
                    {time}
                  </div>
                  {weekDays.map(day => {
                    const dayBookings = getBookingsForSlot(day, time);
                    return (
                      <div 
                        key={`${day.toISOString()}-${time}`}
                        className="min-h-[60px] bg-muted/20 rounded p-1 border border-transparent hover:border-primary/20"
                      >
                        {dayBookings.map(booking => renderBookingCell(booking))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/20 rounded"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-green-500" />
              <span>New</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Recurring</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-500" />
              <span>Regular</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Prepaid</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomerHistoryModal 
        customer={selectedCustomer} 
        onClose={() => setSelectedCustomer(null)} 
      />
    </>
  );
}
