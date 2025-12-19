import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, ChevronRight, DollarSign, Star, UserCheck, UserPlus, Users } from 'lucide-react';
import { DemoBooking, demoEmployees, demoServices, getServiceById, getCustomerById, DemoCustomer } from '@/data/demoData';
import { format } from 'date-fns';
import CustomerHistoryModal from './CustomerHistoryModal';

interface BookingsViewProps {
  bookings: DemoBooking[];
  title: string;
  showAllLink?: boolean;
  onShowAll?: () => void;
}

export default function BookingsView({ bookings, title, showAllLink, onShowAll }: BookingsViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'columns'>('columns');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<DemoCustomer | null>(null);

  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

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
  }, [bookings, serviceFilter, timeFilter]);

  const bookingsByEmployee = useMemo(() => {
    const grouped: Record<string, DemoBooking[]> = {};
    demoEmployees.forEach(emp => {
      grouped[emp.id] = filteredBookings.filter(b => b.employee_id === emp.id);
    });
    return grouped;
  }, [filteredBookings]);

  const getCustomerIcon = (type: string) => {
    switch (type) {
      case 'new': return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'recurring': return <Users className="h-4 w-4 text-blue-500" />;
      case 'regular': return <UserCheck className="h-4 w-4 text-purple-500" />;
      default: return <User className="h-4 w-4" />;
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
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const handleCustomerClick = (customerId: string) => {
    const customer = getCustomerById(customerId);
    if (customer) {
      setSelectedCustomer(customer);
    }
  };

  const renderBookingItem = (booking: DemoBooking, showEmployee = true) => {
    const service = getServiceById(booking.service_id);
    const employee = demoEmployees.find(e => e.id === booking.employee_id);

    return (
      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleCustomerClick(booking.customer_id)}
            className="hover:scale-110 transition-transform cursor-pointer"
            title={`${booking.customer_type} customer - Click for history`}
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
              {showEmployee && employee && (
                <>
                  <span>•</span>
                  <span>{employee.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{booking.booking_time}</span>
          {getStatusBadge(booking.status)}
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
              {title}
              <Badge variant="secondary" className="ml-2">{filteredBookings.length}</Badge>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
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
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'columns')} className="h-8">
                <TabsList className="h-8">
                  <TabsTrigger value="columns" className="text-xs px-2 h-6">By Staff</TabsTrigger>
                  <TabsTrigger value="list" className="text-xs px-2 h-6">List</TabsTrigger>
                </TabsList>
              </Tabs>
              {showAllLink && (
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(true)}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No bookings found</p>
              ) : (
                filteredBookings.slice(0, 10).map(booking => renderBookingItem(booking))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-h-[400px] overflow-y-auto">
              {demoEmployees.map(employee => (
                <div key={employee.id} className="space-y-2">
                  <div className="font-medium text-sm p-2 bg-primary/10 rounded-lg text-center sticky top-0">
                    {employee.name}
                    <Badge variant="secondary" className="ml-2 text-xs">{bookingsByEmployee[employee.id]?.length || 0}</Badge>
                  </div>
                  <div className="space-y-1">
                    {bookingsByEmployee[employee.id]?.slice(0, 8).map(booking => (
                      <div key={booking.id} className={`p-2 rounded text-xs ${booking.status === 'cancelled' ? 'bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-800' : 'bg-muted/30'}`}>
                        <div className="flex items-center gap-1 mb-1">
                          <button 
                            onClick={() => handleCustomerClick(booking.customer_id)}
                            className="hover:scale-110 transition-transform"
                          >
                            {getCustomerIcon(booking.customer_type)}
                          </button>
                          <span className={`font-medium truncate ${booking.status === 'cancelled' ? 'text-red-600 line-through' : ''}`}>{booking.client_name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{booking.booking_time}</span>
                          <div className="flex items-center gap-1">
                            {booking.is_prepaid && (
                              <DollarSign className="h-3 w-3 text-green-600" />
                            )}
                            {booking.status === 'cancelled' && (
                              <Badge variant="destructive" className="text-[10px] px-1 py-0">X</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expanded Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title} - All Bookings</DialogTitle>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {demoEmployees.map(employee => (
              <div key={employee.id} className="space-y-2">
                <div className="font-medium text-sm p-2 bg-primary/10 rounded-lg text-center sticky top-0">
                  {employee.name}
                  <Badge variant="secondary" className="ml-2 text-xs">{bookingsByEmployee[employee.id]?.length || 0}</Badge>
                </div>
                <div className="space-y-1">
                  {bookingsByEmployee[employee.id]?.map(booking => (
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer History Modal */}
      <CustomerHistoryModal 
        customer={selectedCustomer} 
        onClose={() => setSelectedCustomer(null)} 
      />
    </>
  );
}
