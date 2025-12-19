import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ChevronLeft, ChevronRight, DollarSign, User, UserCheck, UserPlus, Users, ArrowLeft } from 'lucide-react';
import { DemoBooking, demoEmployees, demoServices, getServiceById, getCustomerById, DemoCustomer } from '@/data/demoData';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import CustomerHistoryModal from './CustomerHistoryModal';

interface WeeklyBookingsViewProps {
  bookings: DemoBooking[];
}

export default function WeeklyBookingsView({ bookings }: WeeklyBookingsViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<DemoCustomer | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const filteredBookings = useMemo(() => {
    let filtered = bookings.filter(b => {
      const bookingDate = new Date(b.booking_date);
      return bookingDate >= currentWeekStart && bookingDate <= endOfWeek(currentWeekStart, { weekStartsOn: 0 });
    });

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(b => b.service_id === serviceFilter);
    }

    if (timeFilter !== 'all') {
      filtered = filtered.filter(b => {
        const hour = parseInt(b.booking_time.split(':')[0]);
        switch (timeFilter) {
          case 'morning': return hour < 12;
          case 'afternoon': return hour >= 12 && hour < 17;
          case 'evening': return hour >= 17;
          default: return true;
        }
      });
    }

    return filtered;
  }, [bookings, currentWeekStart, serviceFilter, timeFilter]);

  const bookingsByDayByEmployee = useMemo(() => {
    const result: Record<string, Record<string, DemoBooking[]>> = {};
    
    weekDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      result[dateStr] = {};
      demoEmployees.forEach(emp => {
        result[dateStr][emp.id] = filteredBookings.filter(
          b => b.booking_date === dateStr && b.employee_id === emp.id
        );
      });
    });
    
    return result;
  }, [filteredBookings, weekDays]);

  const getCustomerIcon = (type: string) => {
    switch (type) {
      case 'new': return <UserPlus className="h-3 w-3 text-green-500" />;
      case 'recurring': return <Users className="h-3 w-3 text-blue-500" />;
      case 'regular': return <UserCheck className="h-3 w-3 text-purple-500" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      confirmed: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
      'no-show': 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'} className="text-[10px] px-1">{status}</Badge>;
  };

  const handleCustomerClick = (customerId: string) => {
    const customer = getCustomerById(customerId);
    if (customer) {
      setSelectedCustomer(customer);
    }
  };

  const selectedDayBookings = useMemo(() => {
    if (!selectedDay) return {};
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    return bookingsByDayByEmployee[dateStr] || {};
  }, [selectedDay, bookingsByDayByEmployee]);

  const renderWeeklyCalendar = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr>
            <th className="p-2 text-left text-sm font-medium text-muted-foreground w-24">Staff</th>
            {weekDays.map(day => (
              <th key={day.toISOString()} className="p-2 text-center min-w-[100px]">
                <button 
                  onClick={() => setSelectedDay(day)}
                  className="w-full hover:bg-muted/50 rounded-lg p-2 transition-colors"
                >
                  <div className="text-xs text-muted-foreground">{format(day, 'EEE')}</div>
                  <div className="font-medium">{format(day, 'MMM d')}</div>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {demoEmployees.map(employee => (
            <tr key={employee.id} className="border-t">
              <td className="p-2">
                <div className="font-medium text-sm">{employee.name}</div>
                <div className="text-xs text-muted-foreground">{employee.role}</div>
              </td>
              {weekDays.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayBookings = bookingsByDayByEmployee[dateStr]?.[employee.id] || [];
                const count = dayBookings.length;
                
                return (
                  <td key={day.toISOString()} className="p-2 text-center">
                    <button
                      onClick={() => setSelectedDay(day)}
                      className={`w-full py-3 rounded-lg transition-colors ${
                        count > 0 
                          ? 'bg-primary/10 hover:bg-primary/20' 
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      <div className={`text-xl font-bold ${count > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {count}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {count === 1 ? 'booking' : 'bookings'}
                      </div>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDayDetail = () => {
    if (!selectedDay) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{format(selectedDay, 'EEEE, MMMM d, yyyy')}</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {demoEmployees.map(employee => {
            const empBookings = selectedDayBookings[employee.id] || [];
            
            return (
              <div key={employee.id} className="space-y-2">
                <div className="font-medium text-sm p-2 bg-primary/10 rounded-lg text-center">
                  {employee.name}
                  <Badge variant="secondary" className="ml-2 text-xs">{empBookings.length}</Badge>
                </div>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {empBookings.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No bookings</p>
                  ) : (
                    empBookings.map(booking => (
                      <div key={booking.id} className="p-2 bg-muted/30 rounded text-xs">
                        <div className="flex items-center gap-1 mb-1">
                          <button 
                            onClick={() => handleCustomerClick(booking.customer_id)}
                            className="hover:scale-110 transition-transform"
                          >
                            {getCustomerIcon(booking.customer_type)}
                          </button>
                          <span className="font-medium truncate">{booking.client_name}</span>
                        </div>
                        <div className="text-muted-foreground truncate">{getServiceById(booking.service_id)?.name}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span>{booking.booking_time}</span>
                          <div className="flex items-center gap-1">
                            {booking.is_prepaid && <DollarSign className="h-3 w-3 text-green-600" />}
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              This Week's Bookings
              <Badge variant="secondary" className="ml-2">{filteredBookings.length}</Badge>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 0 }), 'MMM d, yyyy')}
                </span>
                <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {demoServices.map(srv => (
                    <SelectItem key={srv.id} value={srv.id}>{srv.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[110px] h-8 text-xs">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Times</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'calendar' | 'list')} className="h-8">
                <TabsList className="h-8">
                  <TabsTrigger value="calendar" className="text-xs px-2 h-6">By Staff</TabsTrigger>
                  <TabsTrigger value="list" className="text-xs px-2 h-6">List</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(true)}>
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              {selectedDay && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Week
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'calendar' ? (
            selectedDay ? renderDayDetail() : renderWeeklyCalendar()
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No bookings this week</p>
              ) : (
                filteredBookings.map(booking => {
                  const service = getServiceById(booking.service_id);
                  const employee = demoEmployees.find(e => e.id === booking.employee_id);
                  
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleCustomerClick(booking.customer_id)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                        >
                          {getCustomerIcon(booking.customer_type)}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{booking.client_name}</span>
                            {booking.is_prepaid && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                <DollarSign className="h-3 w-3 mr-0.5" />
                                Prepaid
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{service?.name}</span>
                            <span>•</span>
                            <span>{employee?.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <div className="text-sm font-medium">{format(new Date(booking.booking_date), 'EEE, MMM d')}</div>
                          <div className="text-xs text-muted-foreground">{booking.booking_time}</div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expanded Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>This Week's Bookings - All</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {demoServices.map(srv => (
                  <SelectItem key={srv.id} value={srv.id}>{srv.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderWeeklyCalendar()}
        </DialogContent>
      </Dialog>

      <CustomerHistoryModal 
        customer={selectedCustomer} 
        onClose={() => setSelectedCustomer(null)} 
      />
    </>
  );
}
